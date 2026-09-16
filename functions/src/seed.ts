import { initializeApp } from "firebase-admin/app";
import { getFirestore, Timestamp } from "firebase-admin/firestore";

initializeApp();
const db = getFirestore();

async function seed() {
  const batch = db.batch();

  // These user documents are application profiles. Firebase Auth accounts
  // should be created separately. For local demo work, create matching
  // Authentication users in the Firebase console or through the signup UI.
  batch.set(db.doc("users/demo-driver"), {
    id: "demo-driver",
    displayName: "Demo Driver",
    email: "driver@example.com",
    role: "driver",
    active: true
  });

  batch.set(db.doc("users/demo-parent"), {
    id: "demo-parent",
    displayName: "Demo Parent",
    email: "parent@example.com",
    role: "parent",
    active: true
  });

  batch.set(db.doc("users/demo-dispatcher"), {
    id: "demo-dispatcher",
    displayName: "Demo Dispatcher",
    email: "dispatcher@example.com",
    role: "dispatcher",
    active: true
  });

  batch.set(db.doc("routes/demo-route"), {
    name: "Route 401 — Morning",
    schoolName: "Demo Secondary School",
    driverId: "demo-driver",
    active: true,
    stopCount: 3,
    totalStopEvents: 0
  });

  const students = [
    ["student-a", { displayName: "Student A", parentIds: ["demo-parent"], active: true }],
    ["student-b", { displayName: "Student B", parentIds: ["demo-parent"], active: true }],
    ["student-c", { displayName: "Student C", parentIds: ["demo-parent"], active: true }]
  ];

  for (const [id, data] of students) batch.set(db.doc(`students/${id}`), data);

  const stops = [
    ["stop-1", "student-a", 1, "100 Demo Street", "07:30"],
    ["stop-2", "student-b", 2, "200 Demo Avenue", "07:38"],
    ["stop-3", "student-c", 3, "300 Demo Road", "07:47"]
  ];

  for (const [id, studentId, sequence, addressLabel, scheduledTime] of stops) {
    batch.set(db.doc(`routeStops/${id}`), {
      routeId: "demo-route",
      studentId,
      sequence,
      addressLabel,
      latitude: 43.65 + Number(sequence) * 0.005,
      longitude: -79.38 - Number(sequence) * 0.005,
      scheduledTime
    });
  }

  const serviceDate = new Date().toISOString().slice(0, 10);
  batch.set(db.doc("trips/demo-trip"), {
    routeId: "demo-route",
    serviceDate,
    driverId: "demo-driver",
    status: "scheduled",
    currentStopSequence: 0,
    createdAt: Timestamp.now()
  });

  await batch.commit();
  console.log(`BTS demo data seeded for ${serviceDate}.`);
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
