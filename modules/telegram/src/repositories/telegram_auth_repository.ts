import { Completer } from 'chat-module';
import { Api, TelegramClient } from 'telegram';

export class TelegramAuthRepository {
  constructor({ telegramClient }: { telegramClient: TelegramClient }) {
    this.telegramClient = telegramClient;
  }

  telegramClient: TelegramClient;

  ready: Completer<void> = new Completer();

  get hasSession(): boolean {
    return this.telegramClient.session.authKey !== undefined;
  }

  async fetchSession(): Promise<void> {
    await this.telegramClient.session.load();
  }

  async init(): Promise<void> {
    this.telegramClient.onError = async (err) => {
      console.log(err);
    };
    await this.fetchSession();
  }

  async signIn({
    phoneProvider,
    passwordProvider,
    codeProvider,
  }: {
    phoneProvider: () => Promise<string>;
    passwordProvider: () => Promise<string>;
    codeProvider: () => Promise<string>;
  }): Promise<void> {
    await this.telegramClient.start({
      phoneNumber: phoneProvider,
      password: passwordProvider,
      phoneCode: codeProvider,
      onError: (err) => {
        console.log(err);
        throw err;
      },
    });
    await this.telegramClient.connect();
    await this.fetchSession();
    this.ready.complete();
    console.log('You should now be connected.');
    console.log(this.telegramClient.session.save()); // Save this string to avoid logging in again
  }

  async getMyUser(): Promise<Api.User> {
    return this.telegramClient.getMe();
  }

  async logout(): Promise<void> {
    await this.telegramClient.disconnect();
    this.telegramClient.session.setAuthKey(undefined);
    this.telegramClient.session.save();
  }
}
