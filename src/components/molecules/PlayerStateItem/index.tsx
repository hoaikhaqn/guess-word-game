"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import classNames from "classnames"
import React, { useEffect, useState } from "react"

export type PlayerData = {
  id?: string
  name?: string
  health?: number
  score?: number
}

type Props = {
  playerData: PlayerData
  keySelected?: string | null
  maxHealth?: number
  thinking?: boolean
}

export default function PlayerStateItem({ playerData, keySelected, thinking = false, maxHealth = 100 }: Props) {
  const { id, name, health, score } = playerData
  // const [remainingTime, setRemainingTime] = useState(thinkingTime)

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setRemainingTime((prevTime) => {
  //       if(prevTime <= 1){
  //         clearInterval(interval)
  //       }
  //       return prevTime - 1
  //     })
  //   }, 1000)
  //   return () => {
  //     clearInterval(interval)
  //   }
  // }, [])

  return (
    <div className="flex flex-col gap-2 justify-center items-center">
      <div className="relative">
        <Avatar className="w-16 h-16 bg-slate-800">
          {id && <AvatarImage src={`https://gravatar.com/avatar/${id}?s=400&d=robohash`} alt="@shadcn" />}
          <AvatarFallback>{name}</AvatarFallback>
        </Avatar>
        {(keySelected || thinking) && (
          <div className="absolute top-[-5px] right-[-10px] m-auto rounded-full bg-white px-3 after:content-[''] after:absolute after:w-0 after:h-0 after:border-l-0 after:border-r-8 after:border-x-transparent after:border-t-4 after:border-t-white">
            <div className="flex w-full h-full justify-center items-center">
              <b className="text-foreground text-sm">{keySelected || "..."}</b>
            </div>
          </div>
        )}
        {/* <div className="absolute bottom-[-7px] left-0 right-0 mx-auto w-[20px] h-[20px] rounded-full bg-danger">
          <div className="flex w-full h-full justify-center items-center">
            <span className="text-white text-[12px] font-medium">{health}</span>
          </div>
        </div> */}
      </div>
      <Badge variant="outline" className="relative border-2 overflow-hidden">
        {health && maxHealth && (
          <div className={classNames("absolute left-0 h-full z-10",{
            "bg-success": health / maxHealth * 100 >= 50,
            "bg-danger": health / maxHealth * 100 < 50
          })} style={{ width: `${health / maxHealth * 100}%` }}></div>
        )}
        <span className="relative z-20">
          {name}: <b className="ml-1">{score}</b>
        </span>
      </Badge>
    </div>
  )
}
