import { Api, TelegramClient } from 'telegram';
import { IterMessagesParams } from 'telegram/client/messages';
import { EntityLike } from 'telegram/define';
import { TotalList } from 'telegram/Helpers';
export declare class TelegramChatRepository {
    constructor({ telegramClient }: {
        telegramClient: TelegramClient;
    });
    client: TelegramClient;
    myUserId: Api.long | undefined;
    setMyUserId(userId: Api.long): void;
    getMessages(entity: EntityLike | undefined, getMessagesParams?: Partial<IterMessagesParams>): Promise<TotalList<Api.Message>>;
    isMyMessage(message: Api.Message): boolean;
}
