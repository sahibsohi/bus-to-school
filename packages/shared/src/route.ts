import type { RouteStop, StopStatus } from "./types";

export function getNextStop(
  stops: RouteStop[],
  statuses: Record<string, StopStatus>
): RouteStop | undefined {
  return [...stops]
    .sort((a, b) => a.sequence - b.sequence)
    .find((stop) => {
      const status = statuses[stop.id] ?? "upcoming";
      return status === "upcoming";
    });
}

export function calculateProgress(
  stops: RouteStop[],
  statuses: Record<string, StopStatus>
): number {
  if (stops.length === 0) return 0;
  const completed = stops.filter((stop) => {
    const status = statuses[stop.id];
    return status === "picked_up" || status === "dropped_off";
  }).length;
  return Math.round((completed / stops.length) * 100);
}
