export abstract class TelegramAuthRepository {
  phoneProvider: () => Promise<string>;
  passwordProvider: () => Promise<string>;
  codeProvider: () => Promise<string>;

  constructor({
    phoneProvider,
    passwordProvider,
    codeProvider,
  }: {
    phoneProvider: () => Promise<string>;
    passwordProvider: () => Promise<string>;
    codeProvider: () => Promise<string>;
  }) {
    this.phoneProvider = phoneProvider;
    this.passwordProvider = passwordProvider;
    this.codeProvider = codeProvider;
  }

  abstract hasSession: boolean;

  abstract init(): Promise<void>;
  abstract signIn(): Promise<void>;
  abstract logout(): Promise<void>;
}
