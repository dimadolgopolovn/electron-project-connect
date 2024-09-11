import { WhatsappChatModule } from '../../wa/whatsapp-chat-module';
import { WhatsappLogin } from '../auth/whatsapp/WhatsappLogin';


export const SettingsView: React.FC<{
  // telegramModule: TelegramChatModule | undefined;
  waModule: WhatsappChatModule | undefined;
}> = (modules) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <h1>Settings</h1>
      <h3>Telegram</h3>
      {/* {modules.telegramModule && (
        <TelegramLogin
          authRepository={modules.telegramModule!.authRepository}
        /> */}
      {/* )} */}

      <div style={{ height: '20px' }}></div>
      <h3>WhatsApp</h3>
      {modules.waModule && <WhatsappLogin module={modules.waModule!} />}
    </div>
  );
};
