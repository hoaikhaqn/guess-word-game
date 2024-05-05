import LobbyTemplate from '@/components/templates/LobbyTemplate'
import React from 'react'

type Props = {
  params: { id: string }
}

export default function page({params}: Props) {
  return <LobbyTemplate />
}
