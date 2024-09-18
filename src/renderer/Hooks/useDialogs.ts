import { useState, useEffect } from 'react'
import { DialogAggregator } from '../modules/common/aggregators/dialogs_aggregator'
import {
  DialogEntity,
  GetDialogsRequest,
} from '../modules/common/entities/dialog_list_entities'
import { useChatModules } from '../Contexts/ChatModulesContext'
import { ChatModule } from '../modules/common/chat_module'

// TODO: This doesn't implement new messages (I left it in DialogsList)

export function useDialogs(request: GetDialogsRequest) {
  const { telegramModule, whatsappModule } = useChatModules()
  const [dialogsList, setDialogsList] = useState<DialogEntity[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  async function tryLoadDialogs() {
    console.log('loadDialogs')
    const modules = [telegramModule, whatsappModule].filter(
      Boolean,
    ) as ChatModule[]

    // checking and waiting for init
    await Promise.all(
      modules.map(async (module) => {
        await module.onAuthComplete.promise
        await module.init()
      }),
    )

    const dialogsAggregator = new DialogAggregator(modules)

    setIsLoading(true)
    try {
      const dialogs = await dialogsAggregator.getDialogsList(request)
      setDialogsList(dialogs)
      console.log(dialogs)
      setError(null)
    } catch (err) {
      setError(
        err instanceof Error
          ? err
          : new Error('An error occurred while loading dialogs'),
      )
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    //TODO: Maybe we should wait for onAuthComplete here?
    tryLoadDialogs()
  }, [])

  return { dialogsList, isLoading, error, tryLoadDialogs }
}
