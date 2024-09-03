import { TelegramClient } from 'telegram';
export declare class TelegramAuthRepository {
    constructor({ telegramClient, phoneProvider, passwordProvider, codeProvider, }: {
        telegramClient: TelegramClient;
        phoneProvider: () => Promise<string>;
        passwordProvider: () => Promise<string>;
        codeProvider: () => Promise<string>;
    });
    telegramClient: TelegramClient;
    phoneProvider: () => Promise<string>;
    passwordProvider: () => Promise<string>;
    codeProvider: () => Promise<string>;
    hasSession: boolean;
    fetchHasSession(): Promise<void>;
    init(): Promise<void>;
    signIn(): Promise<void>;
    logout(): Promise<void>;
}
