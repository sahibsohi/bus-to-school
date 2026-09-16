import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where
} from "firebase/firestore";
import { db } from "../firebase";

export function subscribeToAlerts(callback: (alerts: Record<string, unknown>[]) => void) {
  const q = query(
    collection(db, "serviceAlerts"),
    where("active", "==", true),
    orderBy("startsAt", "desc")
  );

  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
}
