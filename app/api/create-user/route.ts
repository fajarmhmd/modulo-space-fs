import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

const supabaseAdmin = createClient(
process.env.NEXT_PUBLIC_SUPABASE_URL!,
process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req:Request){

const body = await req.json()

const {full_name,email,address,order_id} = body

try{

/* create auth user */

const {data:userData,error:userError} =
await supabaseAdmin.auth.admin.createUser({

email:email,
password:order_id,
email_confirm:true

})

if(userError) throw userError

/* insert profile */

const {error:profileError} =
await supabaseAdmin
.from("profiles")
.insert({

id:userData.user.id,
full_name,
email,
address,
role:"user",
order_id

})

if(profileError) throw profileError

return NextResponse.json({success:true})

}catch(error:any){

return NextResponse.json({
success:false,
error:error.message
})

}
}