# Architecture

The same React Native components render on mobile and web. `App.tsx` switches between a persisted fictional dataset and Firebase subscriptions. Pure domain functions are shared with the Node.js callable backend to keep attendance transitions consistent.

| Collection | Purpose | Read scope |
| --- | --- | --- |
| routes | Name, bus identifier, ordered coordinates and scheduled stop times | Assigned members or dispatcher |
| trips | Route ID, Toronto service date, driver UID, scheduled/active/completed status | Assigned members or dispatcher |
| rides | One rider per trip, stop index, status, pickup/drop-off timestamps | Assigned driver, that rider's guardians/student, or dispatcher |
| notices | Route, message, kind, effective date range, created timestamp | Route members or dispatcher |
| events | Attendance audit action, actor UID, trip/ride IDs, server time | Dispatcher only |

See `functions/src/domain.ts` for complete TypeScript schemas and `src/demo.ts` for fictional examples. Each document stores its own ID. `memberUids` is set by trusted provisioning, never by client writes. Routes contain common stops rather than private home addresses.

All client database writes are denied. Callable functions authenticate the user, read role claims, verify assignment, and validate state transitions. Attendance updates and deterministic event IDs are written in one Firestore transaction. Concurrent duplicate actions cannot create a second attendance event; retries return an invalid-transition error if the first write succeeded. Timestamps come from the backend clock in Firebase mode and device clock in demo mode. No offline write queue is implemented: failed requests remain errors, not confirmed attendance.

Parents and students use `array-contains` membership queries. Firestore's single-field indexes support the implemented queries; no composite index is needed yet. Notice dates and sorting are applied to the bounded loaded dataset. Current reports aggregate loaded records, not a data warehouse. Next production step: service-date partitioning, paginated indexes, dedicated reporting jobs, and query/load measurement.

A ride progresses waiting → onboard → arrived, or waiting → absent. Completing a trip requires no waiting or onboard riders. A mistaken event needs an operator-reviewed correction workflow, not destructive edits; that UI is future work. Trip start/complete records do not yet have a separate audit history.

## Product decisions

- Explicit confirmations communicate what the driver recorded; no implied live GPS.
- Each guardian sees their linked riders, not the entire bus manifest.
- Students can read their own status and route notices directly.
- Cancellation notices support multiple days but do not automatically cancel a trip.
- Navigation opens a directions app to the chosen stop. It is not embedded turn-by-turn navigation or route optimization.
- Fictional demos remain independent of the real operator's enrollment and services.

## Resume alignment

This repository demonstrates a React Native app, Firestore data models, Node.js services, timestamped attendance, and membership-filtered reads. It does not demonstrate 50,000 daily users, measured low latency, a production partnership, or stakeholder interviews. Describe those only if independently supported by your actual experience.
