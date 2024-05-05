export default {
    domain: process.env.DOMAIN || "",
    socketServer: process.env.SOCKET_SERVER || "NOt found",
    hostname: process.env.HOSTNAME || "",
    port: process.env.PORT || "",
    database: {
        uri: process.env.MONGODB_URI || "",
    }
}