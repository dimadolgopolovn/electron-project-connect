import { TelegramClient } from 'telegram';
import { TelegramAuthRepository } from '../../../domain/auth/telegram_auth_repository';

export class TelegramAuthRepositoryImpl extends TelegramAuthRepository {
  telegramClient: TelegramClient;
  hasSession: boolean = false;

  constructor({
    telegramClient,
    phoneProvider,
    passwordProvider,
    codeProvider,
  }: {
    telegramClient: TelegramClient;
    phoneProvider: () => Promise<string>;
    passwordProvider: () => Promise<string>;
    codeProvider: () => Promise<string>;
  }) {
    super({ phoneProvider, passwordProvider, codeProvider });
    this.telegramClient = telegramClient;
  }

  async fetchHasSession(): Promise<void> {
    await this.telegramClient.session.load();
    this.hasSession = this.telegramClient.session.authKey !== undefined;
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
    await this.telegramClient.session.delete();
    await this.telegramClient.session.save();
    this.hasSession = false;
  }
}
