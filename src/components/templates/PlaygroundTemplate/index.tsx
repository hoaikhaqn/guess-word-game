"use client"
import GuessBox from "@/components/molecules/GuessBox"
import PlayerStateItem from "@/components/molecules/PlayerStateItem"
import Keyboard from "@/components/organisms/Keyboard"
import { useToast } from "@/components/ui/use-toast"
import routes from "@/config/routes"
import { changeTurns, chosenLetter, getRoomInfo, submitLetter } from "@/lib/redux/slices/room.slice"
import { AppDispatch, RootState } from "@/lib/redux/store"
import SocketIO from "@/lib/socket"
import { getUserInfo } from "@/lib/utils"
import _ from "lodash"
import { useRouter } from "next/navigation"
import React, { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

type Props = {
  // roomId: string
}

export default function PlaygroundTemplate({}: Props) {
  const router = useRouter()
  const { data: room } = useSelector((state: RootState) => state.room)
  const [isMyTurn, setIsMyTurn] = useState(false)
  const [isRequesting, setIsRequesting] = useState(false)
  const [countdown, setCountdown] = useState(30)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const intervalRef = useRef<NodeJS.Timeout>()
  const self = getUserInfo()
  const dispatch = useDispatch<AppDispatch>()
  const { toast } = useToast()

  const handleSubmitKey = (key: string) => {
    if (room) {
      setIsRequesting(true)
      clearInterval(intervalRef.current)
      dispatch(submitLetter({ room_id: room.room_id, letter: key, player_id: self.id }))
      setTimeout(() => {
        if (room.room_id) {
          dispatch(changeTurns({ room_id: room.room_id }))
          setIsRequesting(false)
        }
      }, 1000)
    }
  }

  const handleChangeKey = (key: string) => {
    if (room && key && self) {
      dispatch(chosenLetter({ room_id: room.room_id, letter: key, player_id: self.id }))
    }
  }

  const startCountdown = () => {
    if (room && Object.keys(room?.players).length > 1) {
      let timeup = false
      intervalRef.current = setInterval(() => {
        if (timeup) {
          toast({
            description: "Time's up!",
            duration: 1000
          })
          handleSubmitKey("")
        } else {
          setCountdown((prevTime) => {
            const nextTime = prevTime - 1
            if (nextTime < 0) {
              timeup = true
              return 30
            }
            return nextTime
          })
        }
      }, 1000)
    }
  }

  const stopCountdown = () => {
    clearInterval(intervalRef.current)
    setCountdown(30)
  }

  // useEffect(() => {
  //   // Load first round data
  //   if (room && Object.keys(room?.rounds).length === 0) {
  //     dispatch(getRoomInfo(room.room_id))
  //   }
  // }, [room])

  useEffect(() => {
    if (isMyTurn) {
      startCountdown()
    } else {
      stopCountdown()
    }
  }, [isMyTurn])

  useEffect(() => {
    if (room?.current_turn_player_id === self?.id) {
      setIsMyTurn(true)
      if (Object.keys(room?.players).length > 1) {
        setTimeout(() => {
          toast({
            description: "Your turn!",
            duration: 1000
          })
        }, 1000)
      }
    } else {
      setIsMyTurn(false)
    }
  }, [room?.current_turn_player_id])

  useEffect(() => {
    if (room?.players) {
      const player_lowest_health = _.chain(room.players).sortBy(["player_health"]).head().value()
      if (player_lowest_health?.player_health <= 0 && player_lowest_health.player_id === self?.id) {
        toast({
          description: "You lose!",
          duration: 10000
        })
      }
    }
  }, [JSON.stringify(room?.players)])

  useEffect(() => {
    if (room?.rounds[room.round_total]?.winner_player_id) {
      router.push(routes.result(room.room_id))
    }
  }, [room?.rounds[room.round_total]?.winner_player_id])

  useEffect(() => {
    if (
      room &&
      _.filter(room?.players, (p) => p.player_health > 0).length <= 1 &&
      Object.keys(room?.players).length > 1
    ) {
      router.push(routes.result(room.room_id))
    }
  }, [room?.players])

  useEffect(() => {
    return () => {
      clearInterval(intervalRef.current)
    }
  }, [])

  if (!self || !room?.rounds || Object.keys(room.rounds).length === 0 || !room.players[self.id]) return null

  return (
    <div ref={wrapperRef} className="flex flex-col w-full gap-5">
      <div className="flex justify-between">
        <h4 className="font-bold">Players: {Object.keys(room.players).length}</h4>
        <h4 className="font-bold">
          Round {room.current_round_number || 0}-{room.round_total}
        </h4>
        <h4 className="font-bold">Room: {room.room_id}</h4>
      </div>
      <fieldset className="px-3 py-2 border-2 border-foreground rounded-md">
        <legend className="px-2">Players</legend>
        <div className="flex gap-2 flex-wrap justify-around">
          {Object.keys(room.players).map((pId) => (
            <PlayerStateItem
              key={room.players[pId].player_id}
              playerData={{
                id: room.players[pId].player_id,
                name: room.players[pId].player_name,
                score: room.players[pId].player_score,
                health: room.players[pId].player_health
              }}
              maxHealth={room.max_health}
              thinking={room.players[pId].player_id === room.current_turn_player_id}
              keySelected={room.players[pId].chosen_letter}
            />
          ))}
        </div>
      </fieldset>
      <div className="flex justify-between px-2">
        <div className="flex gap-5">
          <h4 className="font-bold">Health: {room.players[self.id].player_health}</h4>
        </div>
        <h4 className="font-bold">Time: {Object.keys(room?.players).length > 1 ? countdown : "∞"}</h4>
      </div>
      <div className="mt-3 mb-10 flex flex-col gap-2 items-center justify-center">
        <span className="pb-2 text-sm text-center">
          <b className="mr-2">Hint:</b>
          <span>{room.rounds[room.current_round_number].hints[0] || "Unknown"}</span>
        </span>
        <div className="inline-flex flex-wrap justify-center gap-[10px]">
          {room.rounds[room.current_round_number].correct_letters.map((char, index) => (
            <GuessBox
              key={char + index}
              word={char}
              wordSize={20}
              size={Math.min(
                Math.floor(
                  ((wrapperRef.current?.offsetWidth || 386) -
                    10 * (room.rounds[room.current_round_number].correct_letters.length - 1)) /
                    room.rounds[room.current_round_number].correct_letters.length
                ),
                40
              )}
              guessedLetters={room.rounds[room.current_round_number].guessed_letters || []}
            />
          ))}
        </div>
      </div>
      <Keyboard
        correctKeys={room.rounds[room.current_round_number].correct_letters || []}
        keysSubmitted={room.rounds[room.current_round_number].guessed_letters || []}
        disabled={!isMyTurn || isRequesting}
        onSubmit={handleSubmitKey}
        onChange={handleChangeKey}
      />
    </div>
  )
}
