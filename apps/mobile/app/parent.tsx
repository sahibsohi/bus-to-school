import { StyleSheet, Text, View } from "react-native";

export default function ParentScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.eyebrow}>PARENT VIEW</Text>
      <Text style={styles.title}>Today's ride</Text>

      <View style={styles.status}>
        <View style={styles.dot} />
        <View>
          <Text style={styles.statusTitle}>Bus is on schedule</Text>
          <Text style={styles.muted}>Route 401 · Morning service</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>STUDENT</Text>
        <Text style={styles.student}>Student A</Text>
        <Text style={styles.muted}>Pickup · 7:30 AM</Text>
        <Text style={styles.done}>✓ Picked up</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>SERVICE ALERTS</Text>
        <Text style={styles.alertTitle}>No active alerts</Text>
        <Text style={styles.muted}>BTS will publish cancellations and delays here.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, gap: 16 },
  eyebrow: { fontSize: 12, fontWeight: "800", letterSpacing: 1.5 },
  title: { fontSize: 30, fontWeight: "800" },
  status: { flexDirection: "row", gap: 12, padding: 18, borderRadius: 14, backgroundColor: "#f2f2f2" },
  dot: { width: 12, height: 12, borderRadius: 6, backgroundColor: "#111", marginTop: 5 },
  statusTitle: { fontWeight: "800", fontSize: 17 },
  card: { padding: 20, borderRadius: 16, borderWidth: 1, borderColor: "#ddd", gap: 6 },
  label: { fontSize: 11, fontWeight: "800", letterSpacing: 1 },
  student: { fontSize: 21, fontWeight: "700" },
  alertTitle: { fontWeight: "700", fontSize: 17 },
  muted: { color: "#777" },
  done: { marginTop: 8, fontWeight: "700" }
});
