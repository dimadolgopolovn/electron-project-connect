import { ChatModule, DialogsRepository } from 'chat-module';
import { TelegramClient } from 'telegram';
import { StoreSession } from 'telegram/sessions';
import { TelegramAuthRepository } from './repositories/telegram_auth_repository';
export declare class TelegramChatModule extends ChatModule {
    constructor({ storeSession, apiId, apiHash, authRepositoryBuilder, }: {
        storeSession: StoreSession;
        apiId: number;
        apiHash: string;
        authRepositoryBuilder: (client: TelegramClient) => TelegramAuthRepository;
    });
    enabled: boolean;
    client: TelegramClient;
    dialogsRepository: DialogsRepository;
    authRepository: TelegramAuthRepository;
    init(): Promise<void>;
    checkSignedIn(): Promise<void>;
}
