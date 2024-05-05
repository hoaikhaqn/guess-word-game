import env from "@config/env";

export default {
    checkdb: `${env.domain}/api/checkdb`,
    createRoom: `${env.domain}/api/room/create_room`,
    joinRoom: (id:string) => `${env.domain}/api/room/${id}/join_room`,
    leaveRoom: (id:string) => `${env.domain}/api/room/${id}/leave_room`,
    getRoomData: (id:string) => `${env.domain}/api/room/${id}/get_info`,
    createNewRound: (id:string) => `${env.domain}/api/room/${id}/create_new_round`,
    chosenLetter: (id:string) => `${env.domain}/api/room/${id}/chosen_letter`,
    submitLetter: (id:string) => `${env.domain}/api/room/${id}/submit_letter`,
    changeTurns: (id:string) => `${env.domain}/api/room/${id}/change_turns`,
}