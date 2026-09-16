import { describe, expect, it } from "vitest";
import { calculateProgress, getNextStop } from "../src/route";
import type { RouteStop } from "../src/types";

const stops: RouteStop[] = [
  {
    id: "s1",
    routeId: "r1",
    studentId: "student-1",
    sequence: 1,
    addressLabel: "Stop 1",
    latitude: 43.65,
    longitude: -79.38,
    scheduledTime: "07:30"
  },
  {
    id: "s2",
    routeId: "r1",
    studentId: "student-2",
    sequence: 2,
    addressLabel: "Stop 2",
    latitude: 43.66,
    longitude: -79.39,
    scheduledTime: "07:38"
  }
];

describe("route helpers", () => {
  it("finds the next upcoming stop", () => {
    expect(getNextStop(stops, { s1: "picked_up" })?.id).toBe("s2");
  });

  it("calculates route progress", () => {
    expect(calculateProgress(stops, { s1: "picked_up" })).toBe(50);
    expect(calculateProgress(stops, { s1: "picked_up", s2: "dropped_off" })).toBe(100);
  });
});
