"use client"
import React, { useEffect, useMemo, useRef } from "react"
import InputNumber from "@/components/molecules/InputNumber"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import fetchAPI from "@/lib/fetch"
import endpoints from "@/config/endpoints"
import { getUserInfo } from "@/lib/utils"
import { useRouter } from "next/navigation"
import routes from "@/config/routes"
import { RoomDocument } from "@/models/rooms"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "@/lib/redux/store"
import { createRoom, joinRoom } from "@/lib/redux/slices/room.slice"

export default function CreateRoomTemplate() {
  const dispatch = useDispatch<AppDispatch>()
  const { data: room } = useSelector((state: RootState) => state.room)
  const router = useRouter()
  const submittedRef = useRef<Boolean>(false)
  const formSchema = useMemo(
    () =>
      z.object({
        round_total: z.number().min(1).max(100),
        max_health: z.number().min(1).max(100),
        winning_score: z.number().min(1).max(100)
      }),
    []
  )

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      round_total: 10,
      max_health: 8,
      winning_score: 10
    }
  })

  const handleSubmit = async () => {
    dispatch(createRoom(form.getValues()))
    submittedRef.current = true
  }

  useEffect(() => {
    if (room?.room_id && submittedRef.current) {
      router.push(routes.lobby(room.room_id))
    }
  }, [room?.room_id])

  return (
    <Form {...form}>
      <form className="w-full" onSubmit={form.handleSubmit(handleSubmit)}>
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="underline">Room settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="table w-full">
              <div className="table-row">
                <div className="table-cell py-2">
                  <span className="text-lg font-bold">Rounds:</span>
                </div>
                <div className="table-cell py-2 text-right">
                  <FormField
                    name="round_total"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <InputNumber {...field} min={1} max={100} editable />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="table-row">
                <div className="table-cell py-2">
                  <span className="text-lg font-bold">Players&lsquo; health:</span>
                </div>
                <div className="table-cell py-2 text-right">
                  <FormField
                    name="max_health"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <InputNumber {...field} min={1} max={100} editable />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="table-row">
                <div className="table-cell py-2">
                  <span className="text-lg font-bold">Round&lsquo; score:</span>
                </div>
                <div className="table-cell py-2 text-right">
                  <FormField
                    name="winning_score"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <InputNumber {...field} min={1} max={100} editable />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <center className="mt-10">
          <Button className="px-10 py-6 text-lg">Create room</Button>
        </center>
      </form>
    </Form>
  )
}
