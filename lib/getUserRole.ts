// lib/getUserRole.ts
import { supabase } from "./supabaseClient";

export const getUserRole = async () => {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return null;

  const { data } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userData.user.id)
    .single();

  return data?.role;
};