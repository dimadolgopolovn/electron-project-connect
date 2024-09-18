import { Api, TelegramClient } from 'telegram';
import { StoreSession } from 'telegram/sessions';
import { ChatModule } from '../common/chat_module';
import { DialogsRepository } from '../common/repositories/dialogs_repository';
import { Completer } from '../common/utils/completer';
import { TelegramAuthRepository } from './repositories/telegram_auth_repository';
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
  }

  client: TelegramClient;
  dialogsRepository: DialogsRepository;
  authRepository: TelegramAuthRepository;
  myUser: Api.User | undefined;

  messengerId = 'telegram';

  async init(): Promise<void> {
    await this.client.connect();
    await this.authRepository.init();
    await this.fetchMyUser();
  }

  get onAuthComplete(): Completer<void> {
    return this.authRepository.ready;
  }

  async fetchMyUser() {
    try {
      this.myUser = await this.authRepository.getMyUser();
    } catch (error) {
      console.log('Error fetching my user)');
    }
  }

  checkSignedIn(): Promise<void> {
    return this.authRepository.fetchSession();
  }
}
