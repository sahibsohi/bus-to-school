import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where
} from "firebase/firestore";
import { db } from "../firebase";

export function subscribeToTrip(tripId: string, callback: (data: Record<string, unknown> | null) => void) {
  return onSnapshot(doc(db, "trips", tripId), (snapshot) => {
    callback(snapshot.exists() ? ({ id: snapshot.id, ...snapshot.data() }) : null);
  });
}

export function subscribeToDriverTrips(
  driverId: string,
  serviceDate: string,
  callback: (trips: Record<string, unknown>[]) => void
) {
  const q = query(
    collection(db, "trips"),
    where("driverId", "==", driverId),
    where("serviceDate", "==", serviceDate)
  );

  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
}

export async function recordStopEvent(input: {
  tripId: string;
  routeId: string;
  stopId: string;
  studentId: string;
  type: "pickup" | "dropoff";
  recordedBy: string;
  latitude?: number;
  longitude?: number;
}) {
  await addDoc(collection(db, "stopEvents"), {
    ...input,
    recordedAt: serverTimestamp()
  });
}

export async function updateTripStatus(tripId: string, status: string, currentStopSequence?: number) {
  await updateDoc(doc(db, "trips", tripId), {
    status,
    ...(currentStopSequence === undefined ? {} : { currentStopSequence }),
    ...(status === "in_progress" ? { startedAt: serverTimestamp() } : {}),
    ...(status === "completed" ? { completedAt: serverTimestamp() } : {}),
    updatedAt: serverTimestamp()
  });
}
