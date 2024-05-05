import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import React from "react"
import { StarFilledIcon } from "@radix-ui/react-icons"

type Props = {
  data: {
    player_id: string
    player_name: string
  }
  host?: boolean
}

export default function PlayerItem({ data, host = false }: Props) {
  return (
    <div className="flex flex-col gap-2 justify-center items-center">
      <div className="relative">
        <Avatar className="relative z-10 w-16 h-16 bg-slate-800">
          <AvatarImage src={`https://gravatar.com/avatar/${data.player_id}?s=400&d=robohash`} alt="@shadcn" />
          <AvatarFallback>{data.player_name}</AvatarFallback>
        </Avatar>
        {host && (
          <div className="absolute z-20 top-0 right-0 w-[20px] h-[20px] bg-foreground flex justify-center items-center rounded-full">
            <StarFilledIcon className="text-background" />
          </div>
        )}
      </div>
      <Badge variant="outline">{data.player_name}</Badge>
    </div>
  )
}
