type NotificationOptions = {
  badge?: string
  body?: string
  data?: any
  dir?: NotificationDirection
  icon?: string
  lang?: string
  requireInteraction?: boolean
  silent?: boolean | null
  tag?: string
}

export const showNotification = (title: string, message: string, options?: NotificationOptions) => {
  Notification.requestPermission(function (status) {
    if (status === "granted") {
      navigator.serviceWorker.ready.then((registration) => {
        registration
          .showNotification(title, {
            body: message,
            ...options
          })
          .then(() => registration.getNotifications())
          .then((notifications) => {
            notifications.forEach((notification) => {
              setTimeout(() => notification.close(), 2000)
            })
          })
      })
    }
  })
}
