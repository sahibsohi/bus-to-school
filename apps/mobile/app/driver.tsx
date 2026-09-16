import { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { signOutUser } from "../src/auth";
import { useAuth } from "../src/hooks/useAuth";
import { subscribeToDriverRoutes, subscribeToRouteStops } from "../src/services/routes";
import { recordStopEvent, subscribeToDriverTrips, updateTripStatus } from "../src/services/trips";
import type { RouteStop, StopStatus } from "@bts/shared";

function today() {
  return new Date().toISOString().slice(0, 10);
}

export default function DriverScreen() {
  const { user, profile, loading } = useAuth();
  const [routes, setRoutes] = useState<Record<string, any>[]>([]);
  const [stops, setStops] = useState<Record<string, any>[]>([]);
  const [trips, setTrips] = useState<Record<string, any>[]>([]);
  const [statuses, setStatuses] = useState<Record<string, StopStatus>>({});
  const [routeId, setRouteId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    return subscribeToDriverRoutes(user.uid, setRoutes);
  }, [user]);

  useEffect(() => {
    const selected = routes[0]?.id as string | undefined;
    setRouteId(selected ?? null);
  }, [routes]);

  useEffect(() => {
    if (!routeId) return;
    return subscribeToRouteStops(routeId, setStops);
  }, [routeId]);

  useEffect(() => {
    if (!user) return;
    return subscribeToDriverTrips(user.uid, today(), setTrips);
  }, [user]);

  const trip = useMemo(
    () => trips.find((t) => t.routeId === routeId) ?? null,
    [trips, routeId]
  );

  async function startTrip() {
    if (trip?.id) {
      await updateTripStatus(trip.id, "in_progress", 1);
    }
  }

  async function markPickup(stop: any) {
    if (!user || !trip) return;
    await recordStopEvent({
      tripId: trip.id,
      routeId: stop.routeId,
      stopId: stop.id,
      studentId: stop.studentId,
      type: "pickup",
      recordedBy: user.uid
    });
    setStatuses((s) => ({ ...s, [stop.id]: "picked_up" }));
    await updateTripStatus(trip.id, "in_progress", Number(stop.sequence));
  }

  if (loading) return <View style={styles.center}><Text>Loading…</Text></View>;
  if (!user) return <View style={styles.center}><Text>Please sign in.</Text></View>;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>DRIVER MODE</Text>
          <Text style={styles.title}>{profile?.displayName ?? "Driver"}</Text>
        </View>
        <Pressable onPress={signOutUser}><Text>Sign out</Text></Pressable>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>ASSIGNED ROUTE</Text>
        <Text style={styles.route}>{routes[0]?.name ?? "No route assigned"}</Text>
        <Text style={styles.muted}>{routes[0]?.schoolName ?? "Ask dispatch to assign a route."}</Text>
      </View>

      {!trip ? (
        <View style={styles.card}>
          <Text style={styles.muted}>No trip was scheduled for today.</Text>
        </View>
      ) : trip.status === "scheduled" ? (
        <Pressable style={styles.primary} onPress={startTrip}>
          <Text style={styles.primaryText}>Start today's trip</Text>
        </Pressable>
      ) : (
        <View style={styles.card}>
          <Text style={styles.label}>TRIP STATUS</Text>
          <Text style={styles.route}>{String(trip.status).replace("_", " ")}</Text>
          <Text style={styles.muted}>Current stop sequence: {trip.currentStopSequence ?? 0}</Text>
        </View>
      )}

      <Text style={styles.section}>Stops</Text>
      {stops.map((stop) => {
        const status = statuses[stop.id] ?? "upcoming";
        return (
          <View key={stop.id} style={styles.stop}>
            <View style={{ flex: 1 }}>
              <Text style={styles.student}>{stop.sequence}. Student</Text>
              <Text>{stop.addressLabel}</Text>
              <Text style={styles.muted}>{stop.scheduledTime} · {status.replace("_", " ")}</Text>
            </View>
            {trip && trip.status !== "scheduled" && status === "upcoming" ? (
              <Pressable style={styles.small} onPress={() => markPickup(stop)}>
                <Text style={styles.smallText}>Picked up</Text>
              </Pressable>
            ) : null}
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, gap: 14 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  eyebrow: { fontSize: 11, fontWeight: "900", letterSpacing: 1.5 },
  title: { fontSize: 28, fontWeight: "800" },
  card: { padding: 20, borderRadius: 16, backgroundColor: "#f2f2f2", gap: 6 },
  label: { fontSize: 11, fontWeight: "900", letterSpacing: 1 },
  route: { fontSize: 20, fontWeight: "800" },
  muted: { color: "#777" },
  primary: { backgroundColor: "#111", padding: 17, borderRadius: 12 },
  primaryText: { color: "#fff", textAlign: "center", fontWeight: "800" },
  section: { fontSize: 20, fontWeight: "800", marginTop: 8 },
  stop: { flexDirection: "row", gap: 12, padding: 16, borderWidth: 1, borderColor: "#ddd", borderRadius: 14 },
  student: { fontWeight: "800", fontSize: 16 },
  small: { alignSelf: "center", backgroundColor: "#111", padding: 10, borderRadius: 10 },
  smallText: { color: "#fff", fontWeight: "800" }
});
