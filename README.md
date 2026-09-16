# BTS — Bus to School Operations Platform

A portfolio-grade prototype for a centralized private-school-bussing platform.

BTS is designed around three operational problems:

1. **Drivers** need a reliable, pre-routed digital workflow instead of paper directions.
2. **Parents/students** need real-time visibility into pickup/drop-off status.
3. **Operators** need centralized service alerts and route-performance data.

> This repository is a prototype and is not affiliated with or endorsed by Bus to School. It uses synthetic/demo data and does not contain real student information.

## Architecture

```text
                         ┌────────────────────────┐
                         │      BTS Admin Web      │
                         │   Next.js / Vercel      │
                         └───────────┬────────────┘
                                     │
                                     │ Firebase Auth
                                     ▼
┌──────────────────────┐      ┌──────────────────────┐
│  BTS Mobile App      │─────▶│   Firebase Platform  │
│  Expo / React Native │      │ Auth + Firestore     │
│                      │      │ + Cloud Functions    │
│ Driver + Parent UX   │      └──────────┬───────────┘
└──────────┬───────────┘                 │
           │                             │
           ▼                             ▼
   Location / Maps                Node.js Functions
   route progress                 alerts + analytics
```

## Monorepo

- `apps/mobile` — Expo / React Native mobile app
- `apps/admin` — Next.js operations dashboard, deployable to Vercel
- `functions` — Firebase Cloud Functions (Node.js / TypeScript)
- `packages/shared` — shared domain types and route logic
- `firebase` — Firestore rules, indexes, emulator config and seed data
- `docs` — architecture, data model and product notes

## Core MVP

### Driver
- Sign in
- See assigned route
- See ordered student stops
- Start trip
- Mark student picked up
- Mark student dropped off
- See current trip progress
- Report a delay
- End trip

### Parent
- Sign in
- See assigned child/student
- See today's pickup/drop-off status
- See active service alerts
- See route status

### Operations
- Dashboard with active routes
- View route details
- Publish service alerts
- Monitor pickup/drop-off events
- Review route performance

## Important design decision

The client does **not** decide who can access sensitive student data. Firebase Authentication + Firestore Security Rules enforce authorization. Server-side Cloud Functions use privileged Admin SDK access only for trusted workflows.

Firebase recommends Authentication + Firestore Security Rules for mobile/web clients, and server-side Admin SDK operations must be protected separately with IAM. See the official Firebase security guidance.

## Quick start

### 1. Requirements

- Node.js 20+
- npm
- Expo CLI via `npx`
- Firebase CLI
- A Firebase project
- Optional: Vercel account for the admin dashboard

### 2. Install

```bash
npm install
```

### 3. Configure Firebase

Copy the examples:

```bash
cp apps/mobile/.env.example apps/mobile/.env
cp apps/admin/.env.example apps/admin/.env.local
cp functions/.env.example functions/.env
```

Fill in the Firebase web-app configuration.

**Never commit service-account private keys or production secrets.**

### 4. Run the mobile app

```bash
npm run mobile
```

### 5. Run the admin dashboard

```bash
npm run admin
```

### 6. Run Firebase emulators

```bash
npm run firebase:emulators
```

### 7. Seed demo data

```bash
npm run seed
```

## Suggested build order

1. Firebase Authentication
2. Firestore schema + rules
3. Driver route screen
4. Pickup/drop-off event flow
5. Parent tracking screen
6. Admin dashboard
7. Alerts
8. Route analytics
9. Maps / route polyline integration
10. Push notifications
11. Automated tests + CI
12. Production hardening

## Portfolio positioning

This project intentionally demonstrates:

- React Native
- TypeScript
- Firebase Authentication
- Firestore data modelling
- Firestore Security Rules
- Node.js / Cloud Functions
- Event-driven backend workflows
- Role-based access control
- Timestamped operational events
- Real-time listeners
- Next.js
- Vercel deployment
- Testing and CI
- Scalable query design

The current implementation uses synthetic data. Any real deployment would require substantially more privacy, security, child-safety, consent, retention and operational controls.
