// app/api/admin/create-user/route.ts

import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {

  const body = await req.json()

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email: body.email,
    password: body.password,
    email_confirm: true
  })

  if (error) {
    return Response.json({ error: error.message }, { status: 400 })
  }

  const { error: profileError } = await supabaseAdmin
    .from("profiles")
.upsert({
          id: data.user.id,
      full_name: body.full_name,
      email: body.email,
      address: body.address,
      role: "user",
      order_id: body.order_id
    })

  if (profileError) {
    return Response.json({ error: profileError.message }, { status: 400 })
  }

  return Response.json({ success: true })
}