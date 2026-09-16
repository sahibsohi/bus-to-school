import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function Home() {
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>BTS</Text>
      <Text style={styles.title}>Bus operations, centralized.</Text>
      <Text style={styles.subtitle}>
        Prototype driver + parent experience for a private student-bussing platform.
      </Text>

      <Link href="/driver" style={styles.button}>Driver Demo →</Link>
      <Link href="/parent" style={styles.button}>Parent Demo →</Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 28, justifyContent: "center", gap: 16 },
  logo: { fontSize: 42, fontWeight: "800" },
  title: { fontSize: 28, fontWeight: "700" },
  subtitle: { fontSize: 16, lineHeight: 24, color: "#555" },
  button: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#111",
    color: "white",
    textAlign: "center",
    overflow: "hidden"
  }
});
