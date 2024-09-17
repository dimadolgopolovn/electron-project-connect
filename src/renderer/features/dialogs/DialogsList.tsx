import styled from '@emotion/styled'
import { useEffect, useState } from 'react'
import { StoreSession } from 'telegram/sessions'
import { DialogAggregator } from '../../modules/common/aggregators/dialogs_aggregator'
import { ChatModule } from '../../modules/common/chat_module'
import { LastMessageEntity } from '../../modules/common/entities/dialog_entities'
import { DialogEntity } from '../../modules/common/entities/dialog_list_entities'
import { TelegramChatModule } from '../../modules/telegram/telegram-chat-module'
import { WhatsappChatModule } from '../../modules/whatsapp/whatsapp-chat-module'
import { ChatView } from '../chat/ChatView'
import { SettingsView } from '../settings/SettingsView'
import { DialogTile } from './widgets/DialogTile'

// Left column containing the list of chats
const ChatListColumn = styled.div((props) => ({
  display: 'flex',
  flexDirection: 'column',
  minWidth: '300px',
  width: '300px',
  borderRight: '1px solid #ccc',
  padding: '10px',
  overflowY: 'auto',
  backgroundColor: '#1a222c', // Light background for chat list
}))

// Main container holding both columns
const MainChatContainer = styled.div((props) => ({
  display: 'flex',
  flexDirection: 'row',
  width: '100%',
  height: '100vh', // Full viewport height for the chat window
}))

export const telegramChatModule = new TelegramChatModule({
  storeSession: new StoreSession('telegram_session'),
  apiId: parseInt(process.env.TELEGRAM_API_ID ?? ''),
  apiHash: process.env.TELEGRAM_API_HASH ?? '',
})
export const whatsappChatModule = new WhatsappChatModule()
export const modules: ChatModule[] = [telegramChatModule, whatsappChatModule]
const dialogsAggregator = new DialogAggregator(modules)

async function loadDialogs(): Promise<DialogEntity[]> {
  return dialogsAggregator.getDialogsList({
    limit: 10,
    ignorePinned: false,
    archived: false,
  })
}

export const DialogsList: React.FC = () => {
  const [dialogsList, setDialogsList] = useState<DialogEntity[]>([])
  const [selectedChatIndex, setSelectedChatIndex] = useState(-1)

  useEffect(() => {
    for (const module of modules) {
      module.onAuthComplete.promise.then(async () => {
        await module.init()
        const dialogs = await loadDialogs()
        setDialogsList(dialogs)
        module.dialogsRepository.addNewMessageHandler(
          (message: LastMessageEntity) => {
            const dialogIndex = dialogs.findIndex(
              (dialog) => dialog.id === message.dialogId,
            )
            if (dialogIndex >= 0) {
              const newDialogs = [...dialogs]
              newDialogs[dialogIndex].message = message
              // TODO: check if the message is unread
              newDialogs[dialogIndex].unreadCount++
              setDialogsList(newDialogs)
            }
          },
        )
      })
    }
  }, [])

  return (
    <MainChatContainer>
      <ChatListColumn>
        <DialogTile
          photoBase64={Promise.resolve('')}
          chatId="settings"
          title="Settings"
          subtitle="Change your settings here"
          unreadCount={0}
          isSelected={selectedChatIndex === -1}
          onSelect={() => setSelectedChatIndex(-1)}
        />
        {dialogsList.map((dialog, index) => (
          <DialogTile
            key={dialog.id}
            photoBase64={dialog.photoBase64}
            chatId={dialog.id + ''}
            title={dialog.name ?? dialog.title ?? 'Unknown'}
            subtitle={dialog.message?.messageText ?? ''}
            unreadCount={dialog.unreadCount}
            isSelected={selectedChatIndex === index}
            onSelect={() => setSelectedChatIndex(index)}
          />
        ))}
      </ChatListColumn>

      {selectedChatIndex >= 0 ? (
        <ChatView
          modules={modules}
          dialogEntity={dialogsList[selectedChatIndex]}
        />
      ) : (
        <SettingsView
          telegramModule={telegramChatModule}
          waModule={whatsappChatModule}
        />
      )}
    </MainChatContainer>
  )
}
