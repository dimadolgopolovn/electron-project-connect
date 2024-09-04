import { DialogEntity, DialogsRepository, GetDialogsRequest, LastMessageEntity } from 'chat-module';
import { TelegramClient } from 'telegram';
export declare class TelegramDialogsRepository extends DialogsRepository {
    constructor({ telegramClient }: {
        telegramClient: TelegramClient;
    });
    telegramClient: TelegramClient;
    getDialogsList(request: GetDialogsRequest): Promise<DialogEntity[]>;
    onMessageReceived(newMessage: LastMessageEntity): void;
}
