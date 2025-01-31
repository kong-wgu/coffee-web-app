'use server'
import {coffee} from "@/app/info"

export async function updateData(data : coffee[]){
  console.log(JSON.stringify(data))
  let res = await fetch("https://c964.ngrok.dev/update", {
    method: 'POST',    
    body:JSON.stringify(data),
    headers: {'Content-Type' : 'application/json'},
  }).then((what) => {
    return what;
  })
  console.log(res)
}