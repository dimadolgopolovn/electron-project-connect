import { TelegramClient } from 'telegram';
export declare class TelegramAuthRepository {
    constructor({ telegramClient }: {
        telegramClient: TelegramClient;
    });
    telegramClient: TelegramClient;
    get hasSession(): boolean;
    fetchSession(): Promise<void>;
    init(): Promise<void>;
    signIn({ phoneProvider, passwordProvider, codeProvider, }: {
        phoneProvider: () => Promise<string>;
        passwordProvider: () => Promise<string>;
        codeProvider: () => Promise<string>;
    }): Promise<void>;
    logout(): Promise<void>;
}
