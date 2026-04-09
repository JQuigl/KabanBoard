import { useEffect, useState } from "react";
import { supabase } from "../lib/client.ts";
import { useNavigate } from "react-router-dom";

export default function AuthenticatedRoute({ children }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);

  useEffect(() => {
    const initAuth = async () => {
      const { data: sessionData } = await supabase.auth.getSession();

      // ✅ If session exists → allow access
      if (sessionData.session) {
        setLoading(false);
        return;
      }

      // 🚀 NO SESSION → auto create guest session
      const { error } = await supabase.auth.signInAnonymously();

      if (error) {
        console.error("Guest login failed:", error);
      }

      setLoading(false);
    };

    initAuth();

    // keep auth state in sync
    const { data: listener } = supabase.auth.onAuthStateChange(
      () => {
        setLoading(false);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [navigate]);

  if (loading) return <div>Loading...</div>;

  return children;
}