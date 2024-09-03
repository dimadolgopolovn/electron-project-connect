import { DialogEntity, DialogsRepository, GetDialogsRequest } from 'chat-module';
import { TelegramClient } from 'telegram';
export declare class TelegramDialogsRepository extends DialogsRepository {
    constructor({ telegramClient }: {
        telegramClient: TelegramClient;
    });
    telegramClient: TelegramClient;
    getChats(request: GetDialogsRequest): Promise<DialogEntity[]>;
    getChatById(chatId: string): Promise<DialogEntity>;
}
