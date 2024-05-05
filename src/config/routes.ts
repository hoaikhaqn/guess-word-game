export default {
    home: "/",
    createRoom: "create-room",
    lobby: (roomId:string)=>`/room/${roomId}/lobby`,
    playground: (roomId:string)=>`/room/${roomId}/playground`,
    result: (roomId:string)=>`/room/${roomId}/result`,
}