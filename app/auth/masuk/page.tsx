"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginWithEmail, loginWithGoogle } from "@/lib/auth";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailLogin = async () => {
    const { data, error } = await loginWithEmail(email, password);

    if (error) {
      alert(error.message);
      return;
    }

    const user = data.user;

    const { data: profile } = await supabase
.from("profiles")
.select("role")
      .eq("id", user?.id)
      .single();

    if (profile?.role === "admin") {
      router.push("/admin");
    } else {
      router.push("/profile");
    }
  };

  const handleGoogleLogin = async () => {
    await loginWithGoogle();
  };

  return (
    <div className="flex flex-col gap-4 max-w-md mx-auto mt-20">
      <input
        type="email"
        placeholder="Email"
        className="border p-3 rounded"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      
      <input
        type="password"
        placeholder="Password"
        className="border p-3 rounded"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        onClick={handleEmailLogin}
        className="bg-black text-white p-3 rounded"
      >
        Masuk
      </button>

      <button
        onClick={handleGoogleLogin}
        className="border p-3 rounded"
      >
        Masuk dengan Google
      </button>
    </div>
  );
}