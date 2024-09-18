import styled from '@emotion/styled';
import { useEffect, useState } from 'react';
import { StoreSession } from 'telegram/sessions';
import { Client as WhatsAppClient } from 'whatsapp-web.js';
import { DialogAggregator } from '../../modules/common/aggregators/dialogs_aggregator';
import { ChatModule } from '../../modules/common/chat_module';
import { LastMessageEntity } from '../../modules/common/entities/dialog_entities';
import { DialogEntity } from '../../modules/common/entities/dialog_list_entities';
import { TelegramChatModule } from '../../modules/telegram/telegram_chat_module';
import { WhatsappChatModule } from '../../modules/whatsapp/whatsapp_chat_module';
import { ChatView } from '../chat/ChatView';
import { SettingsView } from '../settings/SettingsView';
import { DialogTile } from './widgets/DialogTile';

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

async function loadDialogs(
  dialogAggregator: DialogAggregator,
): Promise<DialogEntity[]> {
  return dialogAggregator.getDialogsList({
    limit: 10,
    ignorePinned: false,
    archived: false,
  });
}

function getTelegramModule() {
  return new TelegramChatModule({
    storeSession: new StoreSession('telegram_session'),
    apiId: parseInt(process.env.TELEGRAM_API_ID ?? ''),
    apiHash: process.env.TELEGRAM_API_HASH ?? '',
  });
}
async function getWhatsappModule() {
  const maxConnectionAttempts = 10;
  let connectionAttempts = 0;
  let moduleDependencies:
    | {
        client: WhatsAppClient;
        authQr: Promise<string>;
        onReady: Promise<void>;
      }
    | undefined = await WhatsappChatModule.getWADependencies();
  while (!moduleDependencies && connectionAttempts < maxConnectionAttempts) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    moduleDependencies = await WhatsappChatModule.getWADependencies();
    connectionAttempts++;
  }
  if (!moduleDependencies) {
    throw new Error('Failed to connect to WhatsApp');
  }
  return new WhatsappChatModule(moduleDependencies);
}

export const DialogsList: React.FC = () => {
  const [telegramChatModule, setTelegramChatModule] =
    useState<TelegramChatModule | null>(null);
  const [whatsappChatModule, setWhatsappChatModule] =
    useState<WhatsappChatModule | null>(null);
  const [modules, setModules] = useState<ChatModule[]>([]);

  const [dialogsList, setDialogsList] = useState<DialogEntity[]>([]);
  const [selectedChatIndex, setSelectedChatIndex] = useState(-1);

  useEffect(() => {
    const telegramChatModule = getTelegramModule();
    getWhatsappModule().then((whatsappChatModule) => {
      setTelegramChatModule(telegramChatModule);
      setWhatsappChatModule(whatsappChatModule);
      const modules = [telegramChatModule, whatsappChatModule];
      setModules(modules);
      const dialogsAggregator = new DialogAggregator(modules);
      dialogsAggregator.init().then(async () => {
        const dialogs = await loadDialogs(dialogsAggregator);
        setDialogsList(dialogs);
      });
      for (const module of modules) {
        console.log('Waiting for auth complete', module.messengerId);
        module.onAuthComplete.promise.then(async () => {
          console.log('Auth complete', module.messengerId);
          await module.init();
          const dialogs = await loadDialogs(dialogsAggregator);
          setDialogsList(dialogs);
          module.dialogsRepository.addNewMessageHandler(
            (message: LastMessageEntity) => {
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
            },
          );
        });
      }
    });
  }, []);

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
            photoUrl={dialog.photoUrl}
            chatId={dialog.id + ''}
            title={dialog.title ?? 'Unknown'}
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
  );
};
