import { TelegramClient } from 'telegram';
import { StoreSession } from 'telegram/sessions';
import { TelegramAuthRepository } from '../../../domain/auth/telegram_auth_repository';

export class TelegramAuthRepositoryImpl extends TelegramAuthRepository {
  private storeSession = new StoreSession('telegram-session_1');

  telegramClient: TelegramClient;
  hasSession: boolean = false;

  constructor({
    apiId,
    apiHash,
    phoneProvider,
    passwordProvider,
    codeProvider,
  }: {
    apiId: number;
    apiHash: string;
    phoneProvider: () => Promise<string>;
    passwordProvider: () => Promise<string>;
    codeProvider: () => Promise<string>;
  }) {
    super({ phoneProvider, passwordProvider, codeProvider });
    this.telegramClient = new TelegramClient(
      this.storeSession,
      apiId,
      apiHash,
      {
        connectionRetries: 5,
        useWSS: true,
      },
    );
  }

  async fetchHasSession(): Promise<void> {
    await this.storeSession.load();
    this.hasSession = this.storeSession.authKey !== undefined;
  }

  async init(): Promise<void> {
    await this.fetchHasSession();
  }

  async signIn(): Promise<void> {
    await this.telegramClient.start({
      phoneNumber: this.phoneProvider,
      password: this.passwordProvider,
      phoneCode: this.codeProvider,
      onError: (err) => {
        console.log(err);
        throw err;
      },
    });
    await this.fetchHasSession();
    console.log('You should now be connected.');
    console.log(this.telegramClient.session.save()); // Save this string to avoid logging in again
  }

  async logout(): Promise<void> {
    await this.telegramClient.disconnect();
    await this.storeSession.delete();
    await this.telegramClient.session.save();
    this.hasSession = false;
  }
}
