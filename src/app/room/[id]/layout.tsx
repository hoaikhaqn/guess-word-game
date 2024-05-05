"use client"
import endpoints from "@/config/endpoints"
import routes from "@/config/routes"
import useFetch from "@/hooks/useFetch"
import fetchAPI from "@/lib/fetch"
import { getRoomInfo, joinRoom, leaveRoom, outRoom } from "@/lib/redux/slices/room.slice"
import { AppDispatch, RootState } from "@/lib/redux/store"
import SocketIO from "@/lib/socket"
import socket from "@/lib/socket"
import { getUserInfo } from "@/lib/utils"
import { RoomDocument } from "@/models/rooms"
import Link from "next/link"
import React, { PropsWithChildren, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

type Props = {
  params: { id: string }
}

export default function RoomLayout({ params, children }: Props & PropsWithChildren) {
  const [isConnected, setConnected] = useState<boolean>(false)
  const { data: room, isError: roomError } = useSelector((state: RootState) => state.room)
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    const socket = new SocketIO()
    socket.sc.on("connect", () => {
      setConnected(true)
    })
    socket.sc.on("playerJoined", () => {
      dispatch(getRoomInfo(params.id))
    })
    socket.sc.on("playerLeaved", (payload: any) => {
      dispatch(leaveRoom({ room_id: params.id, player_id: payload.player_id }))
    })
    socket.sc.on("roomUpdated", () => {
      console.log("RoomUpdated GET INFO");
      
      dispatch(getRoomInfo(params.id))
    })
    return () => {
      SocketIO.instance = null
      socket.sc.removeAllListeners()
      socket.sc.disconnect()
      dispatch(outRoom())
    }
  }, [])

  useEffect(() => {
    if (room?.room_id) {
      const self = getUserInfo()
      if (self) {
        dispatch(joinRoom({ room_id: room.room_id, player_id: self.id, player_name: self.name }))
      }
    }
    if(!room){
      console.log("LAYOUT GET INFO");
      dispatch(getRoomInfo(params.id))
    }
  }, [room?.room_id])

  if (roomError) {
    return (
      <div>
        <h2 className="text-4xl mb-5 font-bold text-foreground uppercase">Opps! Looks like you are lost.</h2>
        <Link className="text-4xl mb-5 font-bold underline" href={routes.home}>
          Get back
        </Link>
      </div>
    )
  }

  if (!roomError && !isConnected)
    return (
      <div>
        <h2 className="text-4xl mb-5 font-bold text-foreground uppercase">Connecting...</h2>
      </div>
    )

  if (room && !roomError) {
    return <>{children}</>
  }
}
