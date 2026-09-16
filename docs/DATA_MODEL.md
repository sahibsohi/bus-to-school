# BTS Data Model

## users

```json
{
  "displayName": "Demo Driver",
  "email": "driver@example.com",
  "role": "driver",
  "active": true
}
```

Roles:

- `parent`
- `driver`
- `dispatcher`
- `admin`

## students

```json
{
  "displayName": "Student A",
  "parentIds": ["parent-id"],
  "active": true
}
```

## routes

```json
{
  "name": "Route 401 — Morning",
  "schoolName": "Demo Secondary School",
  "driverId": "driver-id",
  "active": true,
  "stopCount": 24,
  "encodedPolyline": "..."
}
```

## routeStops

```json
{
  "routeId": "route-id",
  "studentId": "student-id",
  "sequence": 1,
  "addressLabel": "Demo address",
  "latitude": 43.65,
  "longitude": -79.38,
  "scheduledTime": "07:30"
}
```

## trips

A trip is an execution of a route on a service date.

```json
{
  "routeId": "route-id",
  "serviceDate": "2026-09-16",
  "driverId": "driver-id",
  "status": "in_progress",
  "startedAt": "...",
  "currentStopSequence": 4
}
```

## stopEvents

This is the operational event stream.

```json
{
  "tripId": "trip-id",
  "routeId": "route-id",
  "stopId": "stop-id",
  "studentId": "student-id",
  "type": "pickup",
  "recordedAt": "...",
  "recordedBy": "driver-id",
  "latitude": 43.65,
  "longitude": -79.38
}
```

## serviceAlerts

```json
{
  "title": "Route 401 delayed",
  "message": "The morning bus is approximately 10 minutes behind schedule.",
  "severity": "warning",
  "routeIds": ["route-401"],
  "active": true,
  "startsAt": "...",
  "createdBy": "dispatcher-id"
}
```
