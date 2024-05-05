"use client"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import routes from "@/config/routes"
import { createGuess, getUserInfo } from "@/lib/utils"
import { IUser } from "@/types/user"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import React, { useLayoutEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

export default function MainMenu() {
  const router = useRouter()
  const [user, setUser] = useState<IUser>()
  const formSchema = useMemo(
    () =>
      z.object({
        room_id: z.string()
      }),
    []
  )
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      room_id: ""
    }
  })

  const onChangeUsername = (name: string) => {
    if (user) {
      setUser({ ...user, name })
      localStorage.setItem("user_info", JSON.stringify({ ...createGuess(), name }))
    }
  }

  const handleCreateRoom = async () => {
    router.push(routes.createRoom)
  }

  const handleFindRoom = () => {
    console.log(form.getValues());
    
    const roomId = form.getValues("room_id")
    if (roomId) router.push(routes.lobby(roomId))
  }

  useLayoutEffect(() => {
    if (typeof window !== "undefined") {
      const userInfo = getUserInfo()
      if (userInfo) {
        setUser(userInfo)
      }
    }
  }, [])

  return (
    <>
      <Input
        className="font-bold text-xl text-center"
        onBlur={(e) => onChangeUsername(e.target.value)}
        placeholder="Player's name"
        disabled={!user}
        defaultValue={user?.name}
      />
      <div className="flex flex-col gap-5 w-[200px] ">
        <Button onClick={handleCreateRoom}>Create room</Button>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Join room</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Find room</DialogTitle>
              <DialogDescription>Enter your room's id to join to the room.</DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form className="w-full" onSubmit={form.handleSubmit(handleFindRoom)}>
                <FormField
                  name="room_id"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <Input type="number" placeholder="Room's ID" className="w-full" {...field} />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
            <DialogFooter>
              <Button type="button" onClick={form.handleSubmit(handleFindRoom)}>
                Find room
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  )
}
