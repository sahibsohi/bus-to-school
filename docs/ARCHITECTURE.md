# BTS Architecture

## Product surfaces

### Mobile app

One Expo/React Native codebase supports the driver and parent experiences.

**Driver flow**

```text
Login
  ↓
Today's assigned route
  ↓
Start trip
  ↓
Next stop
  ↓
Pickup event
  ↓
Next stop
  ↓
Drop-off event
  ↓
Trip complete
```

**Parent flow**

```text
Login
  ↓
My child
  ↓
Today's trip status
  ↓
Pickup/drop-off confirmation
  ↓
Service alerts
```

### Operations dashboard

Next.js app intended for Vercel.

```text
Dispatcher
  ↓
Active routes
  ├── route status
  ├── driver
  ├── progress
  ├── delay
  └── student events
```

## Firestore model

```text
users/{userId}
students/{studentId}
routes/{routeId}
routeStops/{stopId}
trips/{tripId}
stopEvents/{eventId}
serviceAlerts/{alertId}
```

### Why events are separate

A `stopEvent` is an immutable operational fact:

- who recorded it
- what happened
- when it happened
- which route/trip/stop/student it belonged to
- optional GPS coordinates

This makes the system useful for both parent visibility and historical operations analytics.

## Scalability considerations

For a real deployment:

- Query stops by `routeId + sequence`.
- Query active alerts by `active + startsAt`.
- Avoid unbounded array growth in route documents.
- Store high-volume events as separate documents.
- Use Cloud Functions for derived metrics rather than making every mobile client update aggregate counters.
- Add pagination to operational event views.
- Use App Check.
- Add automated Security Rules tests.
- Add rate limiting / abuse protection around callable functions.
- Keep service-account credentials exclusively server-side.

## Routing

The MVP stores ordered stops and an optional encoded polyline.

A production implementation can introduce a route-generation service:

```text
dispatcher enters stops
        ↓
server validates addresses
        ↓
routing provider calculates optimized route
        ↓
route + ordered stops + polyline stored in Firestore
        ↓
driver app consumes the assigned route
```

The driver should not have to invent the route on the road.

## Location

For a production app, location updates should be:

- opt-in and role-specific
- limited to operational necessity
- sampled rather than written every second
- retained for a defined period
- inaccessible to unauthorized parents/students

Do not use the prototype with real children's information.
