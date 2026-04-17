

import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request){

const body = await req.json()

const supabaseAdmin = createClient(
process.env.NEXT_PUBLIC_SUPABASE_URL!,
process.env.SUPABASE_SERVICE_ROLE_KEY!
)

await supabaseAdmin
.from("profiles")
.delete()
.eq("id",body.id)

const { error } = await supabaseAdmin.auth.admin.deleteUser(body.id)

if(error){
return Response.json({error:error.message},{status:400})
}

return Response.json({success:true})

}