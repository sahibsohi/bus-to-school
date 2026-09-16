import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "./firebase";
import type { UserProfile, UserRole } from "@bts/shared";

export async function signIn(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email.trim(), password);
}

export async function signOutUser() {
  return signOut(auth);
}

export function subscribeToAuth(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

export async function getMyProfile(uid: string): Promise<UserProfile | null> {
  const snapshot = await getDoc(doc(db, "users", uid));
  return snapshot.exists() ? (snapshot.data() as UserProfile) : null;
}

/**
 * Demo onboarding helper.
 * In a production app, privileged account provisioning should happen
 * through an operator/admin workflow or a trusted server function.
 */
export async function createDemoAccount(
  email: string,
  password: string,
  displayName: string,
  role: UserRole
) {
  const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);
  await setDoc(doc(db, "users", credential.user.uid), {
    id: credential.user.uid,
    displayName,
    email: credential.user.email,
    role,
    active: true,
    createdAt: serverTimestamp()
  });

  return credential.user;
}
