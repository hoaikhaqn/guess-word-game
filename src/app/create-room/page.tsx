import CreateRoomTemplate from "@/components/templates/CreateRoomTemplate"
import endpoints from "@/config/endpoints"
import fetchAPI from "@/lib/fetch"
import React from "react"

export default async function CreateRoom() {
  const { data } = await fetchAPI({ method: "GET", url: endpoints.checkdb , cache: "no-store"})
  console.log("DATA",data);
  
  return <CreateRoomTemplate />
}
