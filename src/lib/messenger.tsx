"use client"
import React from "react"
import { Comments, CustomChat, FacebookProvider, Like, ShareButton, useShare } from "react-facebook"

export default function MessegerFB() {
  return (
    <FacebookProvider appId="102712775611937">
      <Like href="http://www.facebook.com" colorScheme="dark" showFaces share />
    </FacebookProvider>
  )
}
