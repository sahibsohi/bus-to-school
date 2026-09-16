import { initializeApp } from "firebase-admin/app";
import { getFirestore, Timestamp } from "firebase-admin/firestore";
import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { onCall, HttpsError } from "firebase-functions/v2/https";

initializeApp();
const db = getFirestore();

/**
 * Event-driven analytics:
 * every stop event contributes to a route-level operational counter.
 *
 * In production, this should be made idempotent using an event ID / transaction
 * strategy so retries cannot double-count metrics.
 */
export const onStopEventCreated = onDocumentCreated("stopEvents/{eventId}", async (event) => {
  const data = event.data?.data();
  if (!data) return;

  const routeRef = db.doc(`routes/${data.routeId}`);
  await db.runTransaction(async (tx) => {
    const snapshot = await tx.get(routeRef);
    const current = snapshot.exists ? snapshot.data() : {};
    const totalEvents = Number(current?.totalStopEvents ?? 0);

    tx.set(routeRef, {
      totalStopEvents: totalEvents + 1,
      lastEventAt: Timestamp.now()
    }, { merge: true });
  });
});

/**
 * Trusted server-side alert publication endpoint.
 * Authentication/role validation belongs here in addition to client rules.
 */
export const publishServiceAlert = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Authentication required.");
  }

  const user = await db.doc(`users/${request.auth.uid}`).get();
  const role = user.data()?.role;

  if (role !== "dispatcher" && role !== "admin") {
    throw new HttpsError("permission-denied", "Dispatcher or admin role required.");
  }

  const { title, message, severity, routeIds } = request.data ?? {};
  if (typeof title !== "string" || typeof message !== "string") {
    throw new HttpsError("invalid-argument", "title and message are required.");
  }

  const ref = await db.collection("serviceAlerts").add({
    title,
    message,
    severity: severity ?? "info",
    routeIds: Array.isArray(routeIds) ? routeIds : [],
    active: true,
    startsAt: Timestamp.now(),
    createdAt: Timestamp.now(),
    createdBy: request.auth.uid
  });

  return { id: ref.id };
});
