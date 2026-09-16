import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where
} from "firebase/firestore";
import { db } from "../firebase";

export function subscribeToDriverRoutes(
  driverId: string,
  callback: (routes: Record<string, unknown>[]) => void
) {
  const q = query(
    collection(db, "routes"),
    where("driverId", "==", driverId),
    where("active", "==", true)
  );

  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
}

export function subscribeToRouteStops(
  routeId: string,
  callback: (stops: Record<string, unknown>[]) => void
) {
  const q = query(
    collection(db, "routeStops"),
    where("routeId", "==", routeId),
    orderBy("sequence", "asc")
  );

  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
}
