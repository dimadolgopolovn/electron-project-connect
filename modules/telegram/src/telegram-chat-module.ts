import { ChatModule, DialogsRepository } from 'chat-module';
import { TelegramClient } from 'telegram';
import { StoreSession } from 'telegram/sessions';
import { TelegramAuthRepository } from './repositories/telegram_auth_repository';
import { TelegramChatRepository } from './repositories/telegram_chat_repository';
import { TelegramDialogsRepository } from './repositories/telegram_dialogs_repository';

export class TelegramChatModule extends ChatModule {
  constructor({
    storeSession,
    apiId,
    apiHash,
  }: {
    storeSession: StoreSession;
    apiId: number;
    apiHash: string;
  }) {
    super();
    this.client = new TelegramClient(storeSession, apiId, apiHash, {
      connectionRetries: 5,
      useWSS: true,
    });
    this.dialogsRepository = new TelegramDialogsRepository({
      telegramClient: this.client,
      messengerId: this.messengerId,
    });
    this.authRepository = new TelegramAuthRepository({
      telegramClient: this.client,
    });
    this.chatRepository = new TelegramChatRepository({
      telegramClient: this.client,
    });
  }

  client: TelegramClient;
  dialogsRepository: DialogsRepository;
  authRepository: TelegramAuthRepository;
  chatRepository: TelegramChatRepository;

  messengerId = 'telegram';

  get enabled(): boolean {
    return this.authRepository.hasSession;
  }

  async init(): Promise<void> {
    await this.client.connect();
    await this.authRepository.init();
    const myUser = await this.authRepository.getMyUser();
    this.chatRepository.setMyUserId(myUser.id);
  }

  checkSignedIn(): Promise<void> {
    return this.authRepository.fetchSession();
  }
}
