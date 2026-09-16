# BTS Architecture

## Product surfaces

### Mobile app

Expo / React Native supports the driver and parent experiences.

### Operations dashboard

Next.js app intended for Vercel.

## Backend

Firebase provides:

- Authentication
- Firestore
- Security Rules

Firebase Cloud Functions provide:

- privileged workflows
- event-driven processing
- derived operational metrics

## Phase 2 request flow

```text
┌──────────────┐
│ React Native │
└──────┬───────┘
       │
       │ Firebase Auth
       ▼
┌──────────────┐
│ Auth         │
└──────┬───────┘
       │ UID
       ▼
┌─────────────────────────────┐
│ Firestore                   │
│                             │
│ users/{uid}                 │
│ routes/{routeId}            │
│ routeStops/{stopId}         │
│ trips/{tripId}              │
│ stopEvents/{eventId}        │
│ serviceAlerts/{alertId}     │
└──────────────┬──────────────┘
               │
               │ event
               ▼
       ┌─────────────────┐
       │ Cloud Function  │
       └─────────────────┘
```

## Security boundary

The mobile app is an untrusted client.

Firestore Security Rules enforce what authenticated users can read/write.

Cloud Functions run in a privileged environment and therefore must independently validate authorization before performing sensitive operations.

## Data model

```text
users/{userId}
students/{studentId}
routes/{routeId}
routeStops/{stopId}
trips/{tripId}
stopEvents/{eventId}
serviceAlerts/{alertId}
```

## Scalability considerations

- Query stops by `routeId + sequence`.
- Query routes by `driverId + active`.
- Query trips by `driverId + serviceDate`.
- Query active alerts by `active + startsAt`.
- Keep high-volume events separate from stable route documents.
- Avoid unbounded arrays.
- Use server-side functions for derived metrics.
- Paginate high-volume operational history.

## Routing

A production route-generation pipeline can be:

```text
Dispatcher creates/edits stops
            ↓
Server validates addresses
            ↓
Geocoding
            ↓
Routing provider
            ↓
Optimized ordered stops + polyline
            ↓
Firestore
            ↓
Driver app
```

## Location

Production location tracking should be:

- operationally necessary
- consented and disclosed
- sampled rather than written every second
- retained for a defined period
- inaccessible to unauthorized users

Do not use this prototype with real children's information.
