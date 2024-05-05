import endpoints from "@/config/endpoints"
import fetchAPI from "@/lib/fetch"
import { showNotification } from "@/lib/notification/api"
import SocketIO from "@/lib/socket"
import { getUserInfo } from "@/lib/utils"
import { Dispatch, UnknownAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { AppDispatch } from "../store"
import { RoomDocument } from "@/models/rooms"

type RoomStore = {
  data?: RoomDocument
  starting?: boolean
  counter?: number
  isError?: boolean
}

const initialState: RoomStore = {}
const wait_seconds = 5
type createRoomDTO = {
  round_total: number
  max_health: number
  winning_score: number
}
export const createRoom = createAsyncThunk<RoomDocument, createRoomDTO, { rejectValue: any }>(
  "room/createRoom",
  async (DTO, { rejectWithValue }) => {
    const { data, error } = await fetchAPI<RoomDocument>({
      url: endpoints.createRoom,
      method: "POST",
      payload: DTO,
      cache: "no-cache"
    })
    if (error) return rejectWithValue(error)
    return data as RoomDocument
  }
)
export const getRoomInfo = createAsyncThunk<RoomDocument, string, { rejectValue: any }>(
  "room/getRoomInfo",
  async (room_id, { rejectWithValue, dispatch }) => {
    const { data, error } = await fetchAPI<RoomDocument>({
      url: endpoints.getRoomData(room_id),
      method: "GET",
      cache: "no-cache"
    })
    if (error) return rejectWithValue(error)
    return data as RoomDocument
  }
)
type JoinRoomDTO = {
  room_id: string
  player_id: string
  player_name: string
}
export const joinRoom = createAsyncThunk<RoomDocument, JoinRoomDTO, { rejectValue: any }>(
  "room/joinRoom",
  async ({ room_id, player_id, player_name }, { rejectWithValue }) => {
    const { data, error } = await fetchAPI<RoomDocument>({
      url: endpoints.joinRoom(room_id),
      method: "PUT",
      payload: { player_id, player_name },
      cache: "no-cache"
    })
    if (error) return rejectWithValue(error)
    return data as RoomDocument
  }
)
type LeaveRoomDTO = {
  room_id: string
  player_id: string
}
export const leaveRoom = createAsyncThunk<RoomDocument, LeaveRoomDTO, { rejectValue: any }>(
  "room/leaveRoom",
  async ({ room_id, player_id }, { rejectWithValue }) => {
    console.log("LEAVE ROOM")
    const { data, error } = await fetchAPI<RoomDocument>({
      url: endpoints.leaveRoom(room_id),
      method: "PUT",
      payload: { player_id },
      cache: "no-cache"
    })
    if (error) return rejectWithValue(error)
    console.log(data)

    return data as RoomDocument
  }
)
export const createNewRound = createAsyncThunk<RoomDocument, string, { rejectValue: any }>(
  "room/createNewRound",
  async (room_id, { dispatch, rejectWithValue }) => {
    console.log("CREATE ROUND")

    const { data, error } = await fetchAPI<RoomDocument>({
      url: endpoints.createNewRound(room_id),
      method: "PUT",
      cache: "no-cache"
    })
    if (error) return rejectWithValue(error)
    return data as RoomDocument
  }
)
type SendLetterDTO = {
  room_id: string
  player_id: string
  letter: string
}
export const chosenLetter = createAsyncThunk<RoomDocument, SendLetterDTO, { rejectValue: any }>(
  "room/chosenLetter",
  async ({ room_id, player_id, letter }, { rejectWithValue }) => {
    const { data, error } = await fetchAPI<RoomDocument>({
      url: endpoints.chosenLetter(room_id),
      method: "PUT",
      payload: { player_id, letter },
      cache: "no-cache"
    })
    if (error) return rejectWithValue(error)
    return data as RoomDocument
  }
)
export const submitLetter = createAsyncThunk<RoomDocument, SendLetterDTO, { rejectValue: any }>(
  "room/submitLetter",
  async ({ room_id, player_id, letter }, { dispatch, rejectWithValue }) => {
    const { data, error } = await fetchAPI<RoomDocument>({
      url: endpoints.submitLetter(room_id),
      method: "PUT",
      payload: { player_id, letter },
      cache: "no-cache"
    })
    if (error) return rejectWithValue(error)
    if (data?.rounds[data.current_round_number].winner_player_id) {
      await setTimeout(() => {
        dispatch(createNewRound(data.room_id))
      }, 2000);
    }
    return data as RoomDocument
  }
)
type ChangeTurnsDTO = {
  room_id: string
  player_id?: string
}
export const changeTurns = createAsyncThunk<RoomDocument, ChangeTurnsDTO, { rejectValue: any }>(
  "room/changeTurns",
  async ({ room_id, player_id }, { rejectWithValue }) => {
    const { data, error } = await fetchAPI<RoomDocument>({
      url: endpoints.changeTurns(room_id),
      method: "PUT",
      payload: { player_id },
      cache: "no-cache"
    })
    if (error) return rejectWithValue(error)
    return data as RoomDocument
  }
)

export const RoomSlice = createSlice({
  name: "room",
  initialState,
  reducers: {
    outRoom: (state) => {
      return initialState
    },
    startGame: (state) => {
      state.starting = true
      const socket = new SocketIO()
      socket.sc.emit("startGame", { room_id: state.data?.room_id })
      showNotification(`Room ${state.data?.room_id}`, `The Room is being prepared...`)
    },
    countdown: (state) => {
      state.starting = true
      state.counter && state.counter--
      const socket = new SocketIO()
      socket.sc.emit("updateCounter", { room_id: state.data?.room_id, counter: state.counter })
    },
    updateCounter: (state, action) => {
      state.starting = true
      state.counter = action.payload
    },
    resetCounter: (state) => {
      state.starting = false
      state.counter = wait_seconds
    }
  },
  extraReducers: (builder) => {
    builder.addCase(createRoom.fulfilled, (state, action) => {
      const room = action.payload
      state.data = room
      state.starting = false
      state.counter = wait_seconds
    }),
      builder.addCase(getRoomInfo.fulfilled, (state, action) => {
        const room = action.payload
        state.data = room
        if (!state.starting && !state.counter) {
          state.starting = false
          state.counter = wait_seconds
        }
      }),
      builder.addCase(getRoomInfo.rejected, (state, action) => {
        state.isError = true
      }),
      builder.addCase(joinRoom.fulfilled, (state, action) => {
        const self = getUserInfo()
        const room = action.payload
        state.data = room
        const socket = new SocketIO()
        socket.sc.emit("joinRoom", { room_id: room.room_id, player_id: self && self.id })
      }),
      builder.addCase(leaveRoom.fulfilled, (state, action) => {
        const room = action.payload
        state.data = room
      })
    builder.addCase(createNewRound.fulfilled, (state, action) => {
      const room = action.payload
      state.data = room
      const socket = new SocketIO()
      socket.sc.emit("createNewRound", { room_id: room.room_id })
    })
    builder.addCase(chosenLetter.fulfilled, (state, action) => {
      const room = action.payload
      state.data = room
      const socket = new SocketIO()
      console.log("chosenLetter");
      
      socket.sc.emit("updateRoom", { room_id: room.room_id })
    })
    builder.addCase(submitLetter.fulfilled, (state, action) => {
      const room = action.payload
      state.data = room
      const socket = new SocketIO()
      console.log("submitLetter");
      socket.sc.emit("updateRoom", { room_id: room.room_id })
    }),
      builder.addCase(changeTurns.fulfilled, (state, action) => {
        const room = action.payload
        state.data = room
        const socket = new SocketIO()
        console.log("changeTurns");
        socket.sc.emit("updateRoom", { room_id: room.room_id })
      })
  }
})

export const { startGame, countdown, updateCounter, resetCounter, outRoom } = RoomSlice.actions
const RoomReducer = RoomSlice.reducer
export default RoomReducer
