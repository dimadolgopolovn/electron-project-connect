import { useEffect, useState } from 'react'
import { TelegramChatModule } from '../modules/telegram/telegram-chat-module'
import { StoreSession } from 'telegram/sessions'

export function useTelegramChat() {
  const [telegramModule, setTelegramModule] =
    useState<TelegramChatModule | null>(null)

  useEffect(() => {
    const module = new TelegramChatModule({
      storeSession: new StoreSession('telegram_session'),
      apiId: parseInt(process.env.TELEGRAM_API_ID ?? ''),
      apiHash: process.env.TELEGRAM_API_HASH ?? '',
    })
    setTelegramModule(module)

    return () => {
      // Cleanup if necessary
    }
  }, [])

  return telegramModule
}
