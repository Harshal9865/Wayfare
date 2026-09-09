import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://vajjeedldbzcwxwqsmhs.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZhamplZWRsZGJ6Y3d4d3FzbWhzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg4NTk0ODYsImV4cCI6MjEwNDQzNTQ4Nn0.shK3y1YR_bgpgp435OMdUm9d-PT213IQRWKT8BSmrqc";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: "implicit",
  },
});
