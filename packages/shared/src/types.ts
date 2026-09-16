export type UserRole = "parent" | "driver" | "dispatcher" | "admin";

export type TripStatus =
  | "scheduled"
  | "boarding"
  | "in_progress"
  | "delayed"
  | "completed"
  | "cancelled";

export type StopStatus = "upcoming" | "picked_up" | "dropped_off" | "skipped";

export type AlertSeverity = "info" | "warning" | "critical";

export interface UserProfile {
  id: string;
  displayName: string;
  email: string;
  role: UserRole;
  active: boolean;
}

export interface Student {
  id: string;
  displayName: string;
  grade?: string;
  parentIds: string[];
  active: boolean;
}

export interface RouteStop {
  id: string;
  routeId: string;
  studentId: string;
  sequence: number;
  addressLabel: string;
  latitude: number;
  longitude: number;
  scheduledTime: string;
}

export interface Route {
  id: string;
  name: string;
  schoolName: string;
  driverId: string;
  active: boolean;
  stopCount: number;
  encodedPolyline?: string;
}

export interface Trip {
  id: string;
  routeId: string;
  serviceDate: string;
  driverId: string;
  status: TripStatus;
  startedAt?: string;
  completedAt?: string;
  currentStopSequence: number;
}

export interface StopEvent {
  id: string;
  tripId: string;
  routeId: string;
  stopId: string;
  studentId: string;
  type: "pickup" | "dropoff";
  recordedAt: string;
  recordedBy: string;
  latitude?: number;
  longitude?: number;
}

export interface ServiceAlert {
  id: string;
  title: string;
  message: string;
  severity: AlertSeverity;
  routeIds: string[];
  active: boolean;
  startsAt: string;
  endsAt?: string;
  createdBy: string;
}
