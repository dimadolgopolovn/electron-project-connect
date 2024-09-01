import { TelegramClient } from 'telegram';
import {
  DialogEntity,
  GetDialogsRequest,
  TypeMessageMediaEntity,
} from '../../../domain/chats/entities/chats_entities';
import { TelegramDialogsRepository } from '../../../domain/chats/repositories/telegram_dialogs_repository';

export class TelegramDialogsRepositoryImpl extends TelegramDialogsRepository {
  constructor({ telegramClient }: { telegramClient: TelegramClient }) {
    super();
    this.telegramClient = telegramClient;
  }

  telegramClient: TelegramClient;

  async getChats(request: GetDialogsRequest): Promise<DialogEntity[]> {
    const telegramDialogs = await this.telegramClient.getDialogs({
      limit: request.limit,
      offsetDate: request.offsetDate,
      offsetId: request.offsetId,
      ignorePinned: request.ignorePinned,
      folder: request.folder,
      archived: request.archived,
    });
    return telegramDialogs.map<DialogEntity>((dialog) => {
      const lastMessage = dialog.message;
      let telegramMedia = lastMessage?.media;
      let lastMessageMedia: TypeMessageMediaEntity | undefined;
      if (telegramMedia && telegramMedia.className === 'MessageMediaPhoto') {
        lastMessageMedia = {
          spoiler: telegramMedia.spoiler,
          url: telegramMedia.photo?.id, // TODO (gicha): implement this with the correct value
        };
      }

      return <DialogEntity>{
        pinned: dialog.pinned,
        archived: dialog.archived,
        message: {
          id: lastMessage?.id,
          out: lastMessage?.out,
          date: lastMessage?.date,
          fromId: lastMessage?.fromId,
          toId: lastMessage?.toId,
          messageText: lastMessage?.message,
          media: lastMessageMedia,
          replyTo: lastMessage?.replyTo,
          action: lastMessage?.action,
          entities: lastMessage?.entities,
        },
        date: dialog.date,
        id: dialog?.id,
        name: dialog?.name,
        title: dialog?.title,
        unreadCount: dialog.unreadCount,
        unreadMentionsCount: dialog.unreadMentionsCount,
        isUser: dialog.isUser,
        isGroup: dialog.isGroup,
        isChannel: dialog.isChannel,
      };
    });
  }

  getChatById(chatId: string): Promise<DialogEntity> {
    throw new Error('Method not implemented.');
  }
}
