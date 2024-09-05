import styled from '@emotion/styled';
import { ChatModule, DialogAggregator, DialogEntity } from 'chat-module';
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { TelegramChatModule } from 'telegram-chat-module';
import { StoreSession } from 'telegram/sessions';
import { TelegramAuthState } from '../auth/enums/telegram_auth_state';
import { telegramAuthState, TelegramLogin } from '../auth/TelegramLogin';
import { ChatView } from '../chat/ChatView';
import { DialogTile } from './widgets/DialogTile'; // Assuming DialogTile is your chat item component

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
}));

// Main container holding both columns
const MainChatContainer = styled.div((props) => ({
  display: 'flex',
  flexDirection: 'row',
  width: '100%',
  height: '100vh', // Full viewport height for the chat window
}));

const storeSession = new StoreSession('telegram_session');
export const telegramChatModule = new TelegramChatModule({
  storeSession: storeSession,
  apiId: parseInt(process.env.TELEGRAM_API_ID ?? ''),
  apiHash: process.env.TELEGRAM_API_HASH ?? '',
});
export const modules: ChatModule[] = [telegramChatModule];
const dialogsAggregator = new DialogAggregator(modules);

async function loadDialogs(): Promise<DialogEntity[]> {
  return dialogsAggregator.getDialogsList({
    limit: 10,
    ignorePinned: false,
    archived: false,
  });
}

export const DialogsList: React.FC = () => {
  const [dialogsList, setDialogsList] = useState<DialogEntity[]>([]);
  const [selectedChatIndex, setSelectedChatIndex] = useState(-1);
  const [authState] = useRecoilState(telegramAuthState);

  useEffect(() => {
    // TODO: modify auth logic here
    if (authState === TelegramAuthState.HAS_SESSION) {
      async function init() {
        await Promise.all(modules.map((module) => module.init()));
        const dialogs = await loadDialogs();
        setDialogsList(dialogs);
        for (const module of modules) {
          module.dialogsRepository.addNewMessageHandler((message) => {
            const dialogIndex = dialogs.findIndex(
              (dialog) => dialog.id === message.dialogId,
            );
            if (dialogIndex >= 0) {
              const newDialogs = [...dialogs];
              newDialogs[dialogIndex].message = message;
              // TODO: check if the message is unread
              newDialogs[dialogIndex].unreadCount++;
              setDialogsList(newDialogs);
            }
          });
        }
      }
      init();
    }
  }, [authState]);
  return (
    <MainChatContainer>
      {/* Left column: Chat list */}
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
        {/* Add more DialogTile components as needed */}
      </ChatListColumn>

      {/* Right side: Selected chat content */}

      {selectedChatIndex >= 0 ? (
        <ChatView
          modules={modules}
          dialogEntity={dialogsList[selectedChatIndex]}
        />
      ) : (
        // <p>Please select a chat to view the content.</p>
        <TelegramLogin authRepository={telegramChatModule.authRepository} />
      )}
    </MainChatContainer>
  );
};
