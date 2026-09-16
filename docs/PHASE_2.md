# Phase 2 — Firebase Integration

## Goal

Turn the static BTS prototype into a real authenticated application backed by Firebase.

## What was implemented

### Authentication

Firebase Authentication is now the identity layer.

The mobile app:

- listens for authentication state
- supports email/password sign-in
- supports demo account creation
- loads the signed-in user's Firestore profile

### Authorization

The user's application role lives in:

```text
users/{uid}.role
```

Roles are:

```text
parent
driver
dispatcher
admin
```

The Firestore rules use the role to control access.

### Route assignment

Drivers query active routes assigned to their Firebase UID:

```text
routes
  where driverId == auth.uid
  where active == true
```

### Daily trips

Trips are separate documents because the same route can be executed repeatedly:

```text
trips/{tripId}
```

with:

```text
routeId
serviceDate
driverId
status
currentStopSequence
startedAt
completedAt
```

### Operational events

Pickup/drop-off events are stored independently:

```text
stopEvents/{eventId}
```

This preserves operational history and creates a foundation for analytics.

## Important production distinction

The signup flow is intentionally a prototype convenience. A real bus company should not allow arbitrary users to self-assign privileged roles. Driver/dispatcher/admin provisioning should be controlled by authorized operators.

## Testing checklist

### Authentication

- [ ] Invalid password rejected
- [ ] Unknown email rejected
- [ ] Sign out returns to login
- [ ] Refresh preserves auth session

### Authorization

- [ ] Parent cannot modify routes
- [ ] Driver cannot modify another driver's trip
- [ ] Driver cannot create a stop event for another user
- [ ] Dispatcher can publish alerts
- [ ] Admin can delete alerts

### Operational workflow

- [ ] Driver sees assigned route
- [ ] Driver sees ordered stops
- [ ] Driver starts trip
- [ ] Driver records pickup
- [ ] Event appears in Firestore
- [ ] Route-level event counter updates

## Phase 2 architecture interview answer

> "I separated authentication from application authorization. Firebase Auth establishes identity, while a Firestore user profile establishes the operational role. Drivers can query routes assigned to their UID and can only mutate trips assigned to themselves. Pickup/drop-off actions are persisted as separate operational events instead of mutating the route document, which gives the system a historical event stream for analytics."
