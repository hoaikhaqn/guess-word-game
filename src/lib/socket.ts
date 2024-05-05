import env from "@/config/env";
import { io } from "socket.io-client"

export default class SocketIO {
  static instance: any
  public sc: any

  constructor() {
    if (!SocketIO.instance) {
      this.sc = io(env.socketServer) // Thay đổi URL của server tại đây
      SocketIO.instance = this
    }

    return SocketIO.instance
  }
}
