"use client"
import React from "react"
import { Comments, CustomChat, FacebookProvider, Like, ShareButton, useShare } from "react-facebook"

export default function MessegerFB() {
  return (
    <FacebookProvider appId="102712775611937">
       <Comments href="http://www.facebook.com" />
    </FacebookProvider>
  )
}
