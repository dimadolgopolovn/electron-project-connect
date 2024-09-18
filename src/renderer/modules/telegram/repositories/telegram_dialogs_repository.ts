import { Api, TelegramClient } from 'telegram';
import { NewMessage, NewMessageEvent } from 'telegram/events';
import { LastMessageEntity } from '../../common/entities/dialog_entities';
import {
  DialogEntity,
  GetDialogsRequest,
} from '../../common/entities/dialog_list_entities';
import { DialogsRepository } from '../../common/repositories/dialogs_repository';
import { TelegramConverters } from '../utils/telegram_converters';

export class TelegramDialogsRepository extends DialogsRepository {
  constructor({
    telegramClient,
    messengerId,
  }: {
    telegramClient: TelegramClient;
    messengerId: string;
  }) {
    super();
    this.telegramClient = telegramClient;
    this.messengerId = messengerId;
  }

  telegramClient: TelegramClient;
  messengerId: string;

  async getDialogsList(request: GetDialogsRequest): Promise<DialogEntity[]> {
    const telegramDialogs = await this.telegramClient.getDialogs({
      limit: request.limit,
      offsetDate: request.offsetDate,
      offsetId: request.offsetId,
      ignorePinned: request.ignorePinned,
      folder: request.folder,
      archived: request.archived,
    });
    return telegramDialogs.map<DialogEntity>((dialog) =>
      TelegramConverters.toDialogEntity(this.telegramClient, dialog),
    );
  }

  messageCallbackMap: Map<
    (event: LastMessageEntity) => void,
    (event: NewMessageEvent) => void
  > = new Map();

  addNewMessageHandler(callback: (event: LastMessageEntity) => void): void {
    const tgCallback = async (event: NewMessageEvent) => {
      const messageData = event.message;
      if (messageData === undefined) return;
      const chat = await messageData.getChat();
      if (chat === undefined) return;
      const message = messageData as Api.Message;
      callback(TelegramConverters.toLastMessageEntity(message));
    };
    this.messageCallbackMap.set(callback, tgCallback);
    this.telegramClient.addEventHandler(tgCallback, new NewMessage({}));
  }

  removeNewMessageHandler(callback: (event: LastMessageEntity) => void): void {
    const tgCallback = this.messageCallbackMap.get(callback);
    if (tgCallback) {
      this.messageCallbackMap.delete(callback);
      this.telegramClient.removeEventHandler(tgCallback, new NewMessage({}));
    }
  }
}
