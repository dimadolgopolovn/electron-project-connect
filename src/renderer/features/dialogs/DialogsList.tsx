import styled from '@emotion/styled';
import { DialogEntity } from 'chat-module';
import { DialogAggregator } from 'chat-module/dist/aggregators/dialogs_aggregator';
import { ChatModule } from 'chat-module/dist/chat_module';
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { TelegramAuthRepository } from 'telegram-chat-module';
import { TelegramChatModule } from 'telegram-chat-module/dist/telefram-chat-module';
import { StoreSession } from 'telegram/sessions';
import { TelegramAuthState } from '../auth/enums/telegram_auth_state';
import { telegramAuthState, TelegramLogin } from '../auth/TelegramLogin';
import { DialogTile } from './widgets/DialogTile'; // Assuming DialogTile is your chat item component

// Left column containing the list of chats
const ChatListColumn = styled.div((props) => ({
  display: 'flex',
  flexDirection: 'column',
  width: '300px', // Adjust the width as needed for the chat list
  borderRight: '1px solid #ccc',
  padding: '10px',
  overflowY: 'auto',
  backgroundColor: '#012651', // Light background for chat list
}));

// Right side for displaying the selected chat content
const ChatContentArea = styled.div((props) => ({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  padding: '20px',
  overflowY: 'auto',
}));

// Main container holding both columns
const MainChatContainer = styled.div((props) => ({
  display: 'flex',
  flexDirection: 'row',
  width: '100%',
  height: '100vh', // Full viewport height for the chat window
}));

export const telegramChatModule = new TelegramChatModule({
  storeSession: new StoreSession('telegram_session_kdokdkdk'),
  apiId: parseInt(process.env.TELEGRAM_API_ID ?? ''),
  apiHash: process.env.TELEGRAM_API_HASH ?? '',
  authRepositoryBuilder: (client) =>
    new TelegramAuthRepository({ telegramClient: client }),
});
export const modules: ChatModule[] = [telegramChatModule];
const dialogsAggregator = new DialogAggregator(modules);

async function loadDialogs(): Promise<DialogEntity[]> {
  for (const module of modules) {
    console.log(module);
  }
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
      Promise.all(modules.map((module) => module.init())).then(() =>
        loadDialogs().then(setDialogsList),
      );
    }
  }, [authState]);
  return (
    <MainChatContainer>
      {/* Left column: Chat list */}
      <ChatListColumn>
        <DialogTile
          chatId="settings"
          title="Settings"
          subtitle="Change your settings here"
          unreadCount={0}
          isSelected={selectedChatIndex === -1}
          onSelect={() => setSelectedChatIndex(-1)}
        />
        {dialogsList.map((dialog, index) => (
          <DialogTile
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
      <ChatContentArea>
        {selectedChatIndex >= 0 ? (
          <>
            <h1>Chat {selectedChatIndex + 1}</h1>
            {/* Display messages here */}
            <p>This is where the chat content will be displayed.</p>
          </>
        ) : (
          // <p>Please select a chat to view the content.</p>
          <TelegramLogin authRepository={telegramChatModule.authRepository} />
        )}
      </ChatContentArea>
    </MainChatContainer>
  );
};
