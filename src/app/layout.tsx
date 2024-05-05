import type { Metadata } from "next"
import { Poppins } from "next/font/google"
import "./globals.css"
import ReduxProvider from "@/lib/redux/provider"
import NotificationProvider from "@/lib/notification/provider"
import { Toaster } from "@/components/ui/toaster"

const poppins = Poppins({
  weight: ["400", "500", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap"
})

export const metadata: Metadata = {
  title: "Guess word the game",
  description: "Guess word the game"
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  
  return (
    <html lang="en">
      <body className={poppins.className}>
        <ReduxProvider>
          <NotificationProvider>
            <main className="min-h-screen flex flex-col justify-center container items-center p-5 border-foreground border-2">
              {children}
            </main>
            <Toaster />
          </NotificationProvider>
        </ReduxProvider>
      </body>
    </html>
  )
}
