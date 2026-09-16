import { useState } from "react";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { createDemoAccount } from "../src/auth";

export default function Signup() {
  const [name, setName] = useState("Demo Driver");
  const [email, setEmail] = useState("driver2@example.com");
  const [password, setPassword] = useState("password123");
  const [error, setError] = useState("");

  async function submit() {
    try {
      await createDemoAccount(email, password, name, "driver");
      router.replace("/");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to create account.");
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>BTS</Text>
      <Text style={styles.title}>Create demo account</Text>
      <TextInput value={name} onChangeText={setName} placeholder="Name" style={styles.input} />
      <TextInput autoCapitalize="none" value={email} onChangeText={setEmail} placeholder="Email" style={styles.input} />
      <TextInput secureTextEntry value={password} onChangeText={setPassword} placeholder="Password" style={styles.input} />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Pressable style={styles.button} onPress={submit}>
        <Text style={styles.buttonText}>Create driver account</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 28, gap: 12 },
  logo: { fontSize: 44, fontWeight: "900" },
  title: { fontSize: 26, fontWeight: "800", marginBottom: 8 },
  input: { borderWidth: 1, borderColor: "#ddd", borderRadius: 12, padding: 15, fontSize: 16 },
  button: { backgroundColor: "#111", borderRadius: 12, padding: 16 },
  buttonText: { color: "#fff", textAlign: "center", fontWeight: "800" },
  error: { color: "#b00020" }
});
