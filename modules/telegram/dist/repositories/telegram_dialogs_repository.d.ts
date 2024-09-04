import { DialogEntity, DialogsRepository, GetDialogsRequest, LastMessageEntity } from 'chat-module';
import { TelegramClient } from 'telegram';
export declare class TelegramDialogsRepository extends DialogsRepository {
    constructor({ telegramClient, messengerId, }: {
        telegramClient: TelegramClient;
        messengerId: string;
    });
    telegramClient: TelegramClient;
    messengerId: string;
    getDialogsList(request: GetDialogsRequest): Promise<DialogEntity[]>;
    onMessageReceived(newMessage: LastMessageEntity): void;
}
