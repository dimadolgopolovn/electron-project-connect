import React, { createContext, useContext } from 'react'
import { useTelegramChat } from '../Hooks/useTelegramChat'
import { useWhatsappChat } from '../Hooks/useWhatsappChat'

interface ChatModulesContextType {
  telegramModule: ReturnType<typeof useTelegramChat>
  whatsappModule: ReturnType<typeof useWhatsappChat>
}

const ChatModulesContext = createContext<ChatModulesContextType | undefined>(
  undefined,
)

export function ChatModulesProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const telegramModule = useTelegramChat()
  const whatsappModule = useWhatsappChat()

  return (
    <ChatModulesContext.Provider value={{ telegramModule, whatsappModule }}>
      {children}
    </ChatModulesContext.Provider>
  )
}

export function useChatModules() {
  const context = useContext(ChatModulesContext)
  if (context === undefined) {
    throw new Error('useChatModules must be used within a ChatModulesProvider')
  }
  return context
}
