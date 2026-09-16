import { useState } from "react";
import { Link, router } from "expo-router";
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { signIn } from "../src/auth";

export default function Login() {
  const [email, setEmail] = useState("driver@example.com");
  const [password, setPassword] = useState("password123");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit() {
    setBusy(true);
    setError("");
    try {
      await signIn(email, password);
      router.replace("/");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to sign in.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>BTS</Text>
      <Text style={styles.title}>Sign in</Text>
      <Text style={styles.subtitle}>Driver and parent operations</Text>

      <TextInput autoCapitalize="none" keyboardType="email-address" value={email}
        onChangeText={setEmail} placeholder="Email" style={styles.input} />
      <TextInput secureTextEntry value={password}
        onChangeText={setPassword} placeholder="Password" style={styles.input} />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Pressable disabled={busy} style={styles.button} onPress={submit}>
        {busy ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Sign in</Text>}
      </Pressable>

      <Link href="/signup" style={styles.link}>Create demo account →</Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 28, gap: 12 },
  logo: { fontSize: 44, fontWeight: "900" },
  title: { fontSize: 30, fontWeight: "800" },
  subtitle: { color: "#666", marginBottom: 12 },
  input: { borderWidth: 1, borderColor: "#ddd", borderRadius: 12, padding: 15, fontSize: 16 },
  button: { backgroundColor: "#111", borderRadius: 12, padding: 16, minHeight: 54, justifyContent: "center" },
  buttonText: { color: "#fff", textAlign: "center", fontWeight: "800" },
  link: { textAlign: "center", padding: 10 },
  error: { color: "#b00020", fontSize: 13 }
});
