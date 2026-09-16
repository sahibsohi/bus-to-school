import { useEffect, useState } from "react";
import type { User } from "firebase/auth";
import type { UserProfile } from "@bts/shared";
import { getMyProfile, subscribeToAuth } from "../auth";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return subscribeToAuth(async (nextUser) => {
      setUser(nextUser);

      if (!nextUser) {
        setProfile(null);
        setLoading(false);
        return;
      }

      setProfile(await getMyProfile(nextUser.uid));
      setLoading(false);
    });
  }, []);

  return { user, profile, loading };
}
