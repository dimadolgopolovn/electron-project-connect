import { useEffect, useState } from 'react'
import { WhatsappChatModule } from '../modules/whatsapp/whatsapp-chat-module'

export function useWhatsappChat() {
  const [whatsappModule, setWhatsappModule] =
    useState<WhatsappChatModule | null>(null)

  useEffect(() => {
    const module = new WhatsappChatModule()
    setWhatsappModule(module)

    return () => {
      // Cleanup if necessary
    }
  }, [])

  return whatsappModule
}
