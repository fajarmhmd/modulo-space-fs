// app/login-order/page.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function LoginOrderPage(){

const router = useRouter();

const [orderNumber,setOrderNumber] = useState("");
const [password,setPassword] = useState("");
const [loading,setLoading] = useState(false);

const handleLogin = async () => {

setLoading(true);

const orderId = `ORD-${orderNumber.trim()}`;

const { data: profile, error } = await supabase
.from("profiles")
.select("email")
.eq("order_id", orderId)
.single();

if (error || !profile) {
alert("ID Pesanan tidak ditemukan");
setLoading(false);
return;
}

const { error: loginError } = await supabase.auth.signInWithPassword({
email: profile.email,
password: password
});

if (loginError) {
alert(loginError.message);
setLoading(false);
return;
}

router.push("/profile");

};

return(

<div className="min-h-screen flex items-center justify-center bg-gray-50">

<div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md space-y-6">

<h1 className="text-2xl font-bold text-center">
Login dengan ID Pesanan
</h1>

<div className="flex items-center border rounded-lg overflow-hidden">

<span className="px-4 bg-gray-100 font-semibold">
ORD-
</span>

<input
type="text"
placeholder="Masukkan angka ID"
value={orderNumber}
onChange={(e)=>setOrderNumber(e.target.value)}
className="flex-1 p-3 outline-none"
/>

</div>

<input
type="password"
placeholder="Password"
value={password}
onChange={(e)=>setPassword(e.target.value)}
className="w-full border p-3 rounded-lg"
/>

<button
onClick={handleLogin}
disabled={loading}
className="w-full bg-black text-white py-3 rounded-lg"
>

{loading?"Memproses...":"Masuk"}

</button>

</div>

</div>

);

}