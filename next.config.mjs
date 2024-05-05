/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        // matching all API routes
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" }, // replace this your actual origin
          { key: "Access-Control-Allow-Methods", value: "GET,DELETE,PATCH,POST,PUT" },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
          }
        ]
      }
    ]
  },
  reactStrictMode: false,
  env: {
    DOMAIN: "http://192.168.1.8:3000",
    SOCKET_SERVER: "https://socket96-0c82422cf23b.herokuapp.com",
    HOSTNAME: "192.168.1.8",
    PORT: "3000",
    MONGODB_URI: "mongodb+srv://hoaikhaqn1996:0ZyAQ32P8gthP40Z@guesswordgame.ltnxak6.mongodb.net/"
  }
}

export default nextConfig
