import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
  addDoc
} from "firebase/firestore";
import { db } from "../firebase";

export function subscribeToTrip(
  tripId: string,
  callback: (data: Record<string, unknown> | null) => void
) {
  return onSnapshot(doc(db, "trips", tripId), (snapshot) => {
    callback(snapshot.exists() ? (snapshot.data() as Record<string, unknown>) : null);
  });
}

export function subscribeToStops(routeId: string, callback: (rows: Record<string, unknown>[]) => void) {
  const q = query(
    collection(db, "routeStops"),
    where("routeId", "==", routeId),
    orderBy("sequence", "asc")
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

export async function updateTripStatus(tripId: string, status: string) {
  await updateDoc(doc(db, "trips", tripId), {
    status,
    updatedAt: serverTimestamp()
  });
}
