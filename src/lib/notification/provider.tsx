"use client"
import React, { PropsWithChildren, useEffect } from "react"

export default function NotificationProvider({ children }: PropsWithChildren) {
  useEffect(() => {
    // Register service worker
    if ("serviceWorker" in navigator) {
      if (Notification) {
        Notification.requestPermission(function (status) {
          // if (status === "granted") {
          //   navigator.serviceWorker.ready.then(function (registration) {
          //     registration.showNotification("Notification with ServiceWorker")
          //   })
          // }
        })
      }
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          // console.log("Service Worker Registered!", reg)
          reg.pushManager.getSubscription().then((sub) => {
            // console.log("Subscription object: ", sub?.endpoint)
          })
        })
        .catch(function (err) {
          console.log("Service Worker registration failed: ", err)
        })
    }
  }, [])

  return <>{children}</>
}
