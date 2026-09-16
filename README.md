# BTS — Bus to School Operations Platform

BTS is a portfolio-grade prototype for a centralized private-school-bussing operations platform.

> **Prototype notice:** This project is not affiliated with or endorsed by Bus to School. It uses synthetic/demo data and must not be used with real student information.

## Phase 2: Real Firebase integration

This version adds the first real backend workflow:

- Firebase Authentication
- User profiles / roles
- Firestore-backed driver route assignment
- Firestore-backed daily trips
- Real-time route/stop listeners
- Real pickup-event writes
- Server-side event processing
- Firestore Security Rules
- Firestore composite indexes
- Demo account creation
- Local emulator support

### Flow

```text
Driver
  │
  ├── Firebase Auth ──────────────┐
  │                               ▼
  │                         Firestore
  │                         users/{uid}
  │                               │
  │                               ▼
  ├── Assigned route ──────── routes/
  │                               │
  │                               ▼
  ├── Ordered stops ───────── routeStops/
  │                               │
  │                               ▼
  ├── Start trip ───────────── trips/
  │                               │
  └── Pickup ──────────────── stopEvents/
                                  │
                                  ▼
                           Cloud Function
```

## Setup

### 1. Install

```bash
npm install
```

### 2. Create Firebase project

Create a Firebase project, then enable:

- Authentication → Email/Password
- Firestore Database

Create a Firebase Web App and copy its configuration into:

```text
apps/mobile/.env
```

based on `.env.example`.

### 3. Start the app

```bash
npm run mobile
```

### 4. Create a demo account

Open the mobile app → **Create demo account**.

The signup screen creates a Firebase Auth user and a matching `users/{uid}` profile.

### 5. Seed route data

For a local emulator:

```bash
npm run firebase:emulators
npm run seed
```

The seed script creates:

- demo route
- route stops
- students
- daily trip
- demo user profile documents

**Important:** the seed script does not create Firebase Authentication users. Create those through the app or Firebase Authentication.

## Emulator development

Set:

```text
EXPO_PUBLIC_USE_FIREBASE_EMULATORS=true
```

The Firebase service can then be extended to point Auth/Firestore at localhost for fully isolated development.

## Security

The Firestore rules are intentionally restrictive.

Roles:

- `parent`
- `driver`
- `dispatcher`
- `admin`

Drivers can only modify trips assigned to themselves and create stop events as themselves.

Production hardening still required:

- App Check
- Security Rules automated tests
- server-side role provisioning
- audit logging
- rate limiting
- privacy/retention controls
- production monitoring
- notification permissions
- child-safety review

## Phase 2 acceptance test

Once configured, you should be able to:

1. Create a driver account.
2. Sign in.
3. Read the driver's assigned route.
4. Read the route's ordered stops.
5. Read today's assigned trip.
6. Start the trip.
7. Mark a stop as picked up.
8. See a `stopEvents` document appear in Firestore.
9. See the Cloud Function process that event.
10. Sign out and sign back in.

## Next phase

Phase 3 will add the actual map/routing layer:

- route visualization
- geocoding
- route polyline
- driver GPS
- ETA
- route deviation detection
- dispatcher route editing
