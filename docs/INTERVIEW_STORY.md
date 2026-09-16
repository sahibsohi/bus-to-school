# Interview Story

## Problem

Private student-bussing operations can depend on paper directions, manual communication and fragmented operational information.

## Solution

BTS centralizes route execution, pickup/drop-off events and service alerts into a driver/parent mobile experience backed by Firebase and an operations dashboard.

## Technical decisions

### Why React Native / Expo?

One TypeScript codebase can support the mobile driver and parent experiences.

### Why Firestore?

The application's core reads are naturally document-oriented:

- assigned route
- ordered stops
- trip status
- service alerts

Real-time listeners are useful for operational status changes.

### Why separate stop events from route documents?

A route is relatively stable. Stop events are high-volume operational history. Separating them avoids continuously growing route documents and creates an event stream that can later power analytics.

### Why Cloud Functions?

Some operations should not depend on a mobile client being trusted to update aggregate data. Functions can process Firestore events and enforce privileged server-side workflows.

### Why Next.js/Vercel?

Operations staff need a browser-based dashboard. Next.js provides the web application surface and Vercel provides a straightforward deployment target.

## Resume claims to make only after personally validating

- "Built a cross-platform React Native + Firebase application"
- "Designed Firestore data models for timestamped pickup/drop-off events"
- "Built Node.js Cloud Functions for event-driven operational analytics"
- "Built a Next.js operations dashboard"
- "Implemented role-based Firestore Security Rules"

Do not claim real users, production traffic, 50,000 daily riders, or production deployment unless those facts are actually true.
