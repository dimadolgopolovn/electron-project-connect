import { TelegramClient } from 'telegram';

export class TelegramAuthRepository {
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
    this.telegramClient = telegramClient;
    this.phoneProvider = phoneProvider;
    this.passwordProvider = passwordProvider;
    this.codeProvider = codeProvider;
  }

  telegramClient: TelegramClient;
  phoneProvider: () => Promise<string>;
  passwordProvider: () => Promise<string>;
  codeProvider: () => Promise<string>;

  hasSession: boolean = false;

  async fetchHasSession(): Promise<void> {
    await this.telegramClient.session.load();
    this.hasSession = this.telegramClient.session.authKey !== undefined;
  }

  async init(): Promise<void> {
    this.telegramClient.onError = async (err) => {
      console.log(err);
    };
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
    this.telegramClient.session.setAuthKey(undefined);
    this.telegramClient.session.save();
    this.hasSession = false;
  }
}
