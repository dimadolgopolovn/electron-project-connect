import { ChatModule, DialogsRepository } from 'chat-module';
import { TelegramClient } from 'telegram';
import { StoreSession } from 'telegram/sessions';
import { TelegramAuthRepository } from './repositories/telegram_auth_repository';
import { TelegramChatRepository } from './repositories/telegram_chat_repository';
export declare class TelegramChatModule extends ChatModule {
    constructor({ storeSession, apiId, apiHash, }: {
        storeSession: StoreSession;
        apiId: number;
        apiHash: string;
    });
    client: TelegramClient;
    dialogsRepository: DialogsRepository;
    authRepository: TelegramAuthRepository;
    chatRepository: TelegramChatRepository;
    messengerId: string;
    get enabled(): boolean;
    init(): Promise<void>;
    checkSignedIn(): Promise<void>;
}
