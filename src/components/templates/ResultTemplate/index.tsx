"use client"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import routes from "@/config/routes"
import { RootState } from "@/lib/redux/store"
import { getOrdinalSuffix } from "@/lib/utils"
import { PlayerItem, RoomDocument } from "@/models/rooms"
import _ from "lodash"
import { useRouter } from "next/navigation"
import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"

export default function ResultTemplate() {
  const { data: room } = useSelector((state: RootState) => state.room)
  const [players,setPlayers] = useState<Record<string,PlayerItem>>()
  const router = useRouter()

  useEffect(() => {

    if(room && !players){
      setPlayers({...room.players})
    }
  }, [JSON.stringify(room?.players)])

  

  return (
    <>
      <fieldset className="px-3 py-2 border-2 border-foreground rounded-md w-full">
        <legend className="px-2 text-2xl font-bold">Result</legend>
        <div className="p-5 flex flex-col gap-7">
          {_.sortBy(players, ["player_score", "player_health"]).reverse().map((p, index) => (
            <>
              {/* {index > 0 && <Separator className="my-0" />} */}
              <div className="flex flex-col ">
                <div className="flex justify-between">
                    <div className="text-xl font-bold">{p.player_name}</div>
                    <div className="text-xl font-bold">{getOrdinalSuffix(index+1)}</div>
                </div>
                <Separator className="my-2" />
                <div className="flex-1">
                  <div className="flex justify-between">
                    <div className="font-bold">Score: </div>
                    <div>{p.player_score}</div>
                  </div>
                  <div className="flex justify-between">
                    <div className="font-bold">Health:</div>
                    <div>{p.player_health}</div>
                  </div>
                </div>
              </div>
            </>
          ))}
        </div>
      </fieldset>
      <Button className="my-5" onClick={()=>router.push(routes.home)}>
        Go home
      </Button>
    </>
  )
}
