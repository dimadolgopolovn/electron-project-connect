import { Api, TelegramClient } from 'telegram';
import { IterMessagesParams } from 'telegram/client/messages';
import { EntityLike } from 'telegram/define';
import { TotalList } from 'telegram/Helpers';

export class TelegramChatRepository {
  constructor({ telegramClient }: { telegramClient: TelegramClient }) {
    this.client = telegramClient;
  }

  client: TelegramClient;
  myUserId: Api.long | undefined;

  setMyUserId(userId: Api.long): void {
    this.myUserId = userId;
  }

  async getMessages(
    entity: EntityLike | undefined,
    getMessagesParams?: Partial<IterMessagesParams>,
  ): Promise<TotalList<Api.Message>> {
    return this.client.getMessages(entity, getMessagesParams);
  }

  isMyMessage(message: Api.Message): boolean {
    return message.senderId?.equals(this.myUserId!) ?? false;
  }
}
