import { TelegramChatModule } from '../../modules/telegram/telegram-chat-module';
import { WhatsappChatModule } from '../../modules/whatsapp/whatsapp-chat-module';
import { TelegramLogin } from '../auth/telegram/TelegramLogin';
import { WhatsappLogin } from '../auth/whatsapp/WhatsappLogin';

export const SettingsView: React.FC<{
  telegramModule: TelegramChatModule | null;
  waModule: WhatsappChatModule | null;
}> = (modules) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <h1>Settings</h1>
      <h3>Telegram</h3>
      {modules.telegramModule && (
        <TelegramLogin
          authRepository={modules.telegramModule!.authRepository}
        />
      )}

      <div style={{ height: '20px' }}></div>
      <h3>WhatsApp</h3>
      {modules.waModule && <WhatsappLogin module={modules.waModule!} />}
    </div>
  );
};
