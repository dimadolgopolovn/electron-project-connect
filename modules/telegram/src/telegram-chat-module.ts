import { ChatModule, DialogsRepository } from 'chat-module';
import { TelegramClient } from 'telegram';
import { StoreSession } from 'telegram/sessions';
import { TelegramAuthRepository } from './repositories/telegram_auth_repository';
import { TelegramDialogsRepository } from './repositories/telegram_dialogs_repository';

export class TelegramChatModule extends ChatModule {
  constructor({
    storeSession,
    apiId,
    apiHash,
    authRepositoryBuilder,
  }: {
    storeSession: StoreSession;
    apiId: number;
    apiHash: string;
    authRepositoryBuilder: (client: TelegramClient) => TelegramAuthRepository;
  }) {
    super();
    this.client = new TelegramClient(storeSession, apiId, apiHash, {
      connectionRetries: 5,
      useWSS: true,
    });
    this.dialogsRepository = new TelegramDialogsRepository({
      telegramClient: this.client,
    });
    this.authRepository = authRepositoryBuilder(this.client);
  }

  client: TelegramClient;
  dialogsRepository: DialogsRepository;
  authRepository: TelegramAuthRepository;

  get enabled(): boolean {
    return this.authRepository.hasSession;
  }

  async init(): Promise<void> {
    await this.client.connect();
    await this.authRepository.init();
  }

  checkSignedIn(): Promise<void> {
    return this.authRepository.fetchSession();
  }
}
