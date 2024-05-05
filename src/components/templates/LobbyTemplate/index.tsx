"use client"
import PlayerItem from "@/components/molecules/PlayerItem"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import routes from "@/config/routes"
import { showNotification } from "@/lib/notification/api"
import { countdown, createNewRound, resetCounter, startGame, updateCounter } from "@/lib/redux/slices/room.slice"
import { AppDispatch, RootState } from "@/lib/redux/store"
import SocketIO from "@/lib/socket"
import { getUserInfo } from "@/lib/utils"
import _ from "lodash"
import { useRouter } from "next/navigation"
import React, { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Socket } from "socket.io-client"

type Props = {
  // roomId: string
}

const timer = 10 //seconds

export default function LobbyTemplate({}: Props) {
  const router = useRouter()
  const { data: room, starting, counter } = useSelector((state: RootState) => state.room)
  const self = getUserInfo()
  const dispatch = useDispatch<AppDispatch>()
  const intervalRef = useRef<NodeJS.Timeout>()
  const isStartedRef = useRef<boolean>()

  const handleStart = () => {
    dispatch(startGame())
    intervalRef.current = setInterval(() => {
      if (room && counter) {
        dispatch(countdown())
      }
    }, 1000)
  }

  const handleCancel = () => {
    dispatch(resetCounter())
    const socket = new SocketIO()
    socket.sc.emit("cancelCounter", { room_id: room?.room_id })
    clearTimeout(intervalRef.current)
  }

  useEffect(() => {
    const socket = new SocketIO()
    socket.sc.on("gameStarted", () => {
      showNotification(`Room ${room?.room_id}`, `The Room is being prepared...`)
    })
    socket.sc.on("countdownUpdated", (counter:number) => {
      dispatch(updateCounter(counter))
    })
    socket.sc.on("counterCanceled", () => {
      dispatch(resetCounter())
    })
    
    return () => {
      clearTimeout(intervalRef.current)
    }
  }, [])

  useEffect(() => {
    if (room && counter === 0) {
      clearTimeout(intervalRef.current)
      if(Object.keys(room.rounds).length === 0 && _.find(room.players,p=>p.order === 1)?.player_id === self.id){
        dispatch(createNewRound(room.room_id))
      }
      router.push(routes.playground(room.room_id))
      dispatch(resetCounter())
    }
  }, [counter])

  if (!room) return null
  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="underline">Room: {room.room_id}</CardTitle>
        </CardHeader>
        <CardContent>
          <h6 className="text-lg font-bold mb-3">Players:</h6>
          <div className="flex flex-wrap gap-4">
            {(Object.keys(room.players).length > 0 &&
              _.sortBy(room.players, ["order"]).map((p, index) => (
                <PlayerItem key={p.player_id} data={p} host={p.order === 1} />
              ))) || <h2>Loading...</h2>}
          </div>
        </CardContent>
      </Card>
      <center>
        {starting && counter && <h2 className="text-bold text-xl mt-3">Ready in {counter} seconds</h2>}
        {!starting && self && room.players[self?.id]?.order === 1 && (
          <Button className="my-5" onClick={handleStart}>
            Start game
          </Button>
        )}
        {starting && self && room.players[self?.id]?.order === 1 && (
          <Button className="my-5" onClick={handleCancel}>
            Cancel
          </Button>
        )}
      </center>
    </>
  )
}
