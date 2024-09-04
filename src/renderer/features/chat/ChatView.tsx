import { ChatModule, DialogEntity } from 'chat-module';
import { TelegramChatModule } from 'telegram-chat-module';
import { TelegramChatView } from './TelegramChatView';

export const ChatView: React.FC<{
  modules: ChatModule[];
  dialogEntity: DialogEntity;
}> = ({ modules, dialogEntity }) => {
  if (dialogEntity.messengerId === 'telegram') {
    return (
      <TelegramChatView
        chatModule={
          modules.find(
            (module) => module.messengerId === 'telegram',
          ) as TelegramChatModule
        }
        dialogEntity={dialogEntity}
      />
    );
  }
  return <div>Unknown Chat</div>;
};
