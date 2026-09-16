import { calculateProgress, getNextStop } from "@bts/shared";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

const demoStops = [
  { id: "stop-1", student: "Student A", sequence: 1, address: "100 Demo Street", time: "7:30 AM" },
  { id: "stop-2", student: "Student B", sequence: 2, address: "200 Demo Avenue", time: "7:38 AM" },
  { id: "stop-3", student: "Student C", sequence: 3, address: "300 Demo Road", time: "7:47 AM" }
];

export default function DriverScreen() {
  const [statuses, setStatuses] = useState<Record<string, "upcoming" | "picked_up" | "dropped_off">>({});
  const [tripStarted, setTripStarted] = useState(false);

  const sharedStops = demoStops.map((s) => ({
    id: s.id,
    routeId: "demo-route",
    studentId: s.id,
    sequence: s.sequence,
    addressLabel: s.address,
    latitude: 43.65,
    longitude: -79.38,
    scheduledTime: s.time
  }));

  const next = useMemo(() => getNextStop(sharedStops, statuses), [statuses]);
  const progress = calculateProgress(sharedStops, statuses);

  function completeStop(id: string) {
    setStatuses((current) => ({ ...current, [id]: "picked_up" }));
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.eyebrow}>DRIVER MODE</Text>
      <Text style={styles.title}>Route 401 — Morning</Text>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>ROUTE PROGRESS</Text>
        <Text style={styles.progress}>{progress}%</Text>
        <Text>{tripStarted ? "Trip in progress" : "Trip not started"}</Text>
      </View>

      {!tripStarted ? (
        <Pressable style={styles.primary} onPress={() => setTripStarted(true)}>
          <Text style={styles.primaryText}>Start Trip</Text>
        </Pressable>
      ) : (
        <>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>NEXT STOP</Text>
            <Text style={styles.next}>{next?.addressLabel ?? "Route complete"}</Text>
            <Text>{next ? `Pickup scheduled ${next.scheduledTime}` : "All stops complete"}</Text>
          </View>

          {demoStops.map((stop) => {
            const status = statuses[stop.id] ?? "upcoming";
            return (
              <View key={stop.id} style={styles.stop}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.student}>{stop.sequence}. {stop.student}</Text>
                  <Text>{stop.address}</Text>
                  <Text style={styles.muted}>{stop.time} · {status.replace("_", " ")}</Text>
                </View>
                {status === "upcoming" && (
                  <Pressable style={styles.smallButton} onPress={() => completeStop(stop.id)}>
                    <Text style={styles.smallButtonText}>Picked up</Text>
                  </Pressable>
                )}
              </View>
            );
          })}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, gap: 14 },
  eyebrow: { fontSize: 12, fontWeight: "800", letterSpacing: 1.5 },
  title: { fontSize: 28, fontWeight: "800" },
  card: { padding: 20, borderRadius: 16, backgroundColor: "#f2f2f2", gap: 6 },
  cardLabel: { fontSize: 11, fontWeight: "800", letterSpacing: 1 },
  progress: { fontSize: 34, fontWeight: "800" },
  next: { fontSize: 20, fontWeight: "700" },
  primary: { padding: 17, borderRadius: 12, backgroundColor: "#111" },
  primaryText: { color: "#fff", textAlign: "center", fontWeight: "700" },
  stop: { flexDirection: "row", gap: 12, padding: 16, borderWidth: 1, borderColor: "#ddd", borderRadius: 14 },
  student: { fontWeight: "700", fontSize: 16 },
  muted: { color: "#777", marginTop: 4 },
  smallButton: { alignSelf: "center", padding: 10, borderRadius: 10, backgroundColor: "#111" },
  smallButtonText: { color: "#fff", fontWeight: "700" }
});
