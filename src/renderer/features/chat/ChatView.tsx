import { ChatModule } from '../../modules/common/chat_module';
import { DialogEntity } from '../../modules/common/entities/dialog_list_entities';
import { TelegramChatModule } from '../../modules/telegram/telegram_chat_module';
import { WhatsappChatModule } from '../../modules/whatsapp/whatsapp_chat_module';
import { TelegramChatView } from './TelegramChatView';
import { WhatsAppChatView } from './WhatsAppChatView';

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
  if (dialogEntity.messengerId === 'whatsapp') {
    return (
      <WhatsAppChatView
        chatModule={
          modules.find(
            (module) => module.messengerId === 'whatsapp',
          ) as WhatsappChatModule
        }
        dialogEntity={dialogEntity}
        chat={dialogEntity.nativeChatObject}
      />
    );
  }
  return <div>Unknown Chat</div>;
};
