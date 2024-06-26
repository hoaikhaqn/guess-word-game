import { useDispatch } from "react-redux"
import { configureStore } from "@reduxjs/toolkit"
import RoomReducer from "./slices/room.slice"

export const store = configureStore({
  reducer: {
    room: RoomReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>()
