import {
  DialogEntity,
  DialogsRepository,
  GetDialogsRequest,
  LastMessageEntity,
  TypeMessageMediaEntity,
} from 'chat-module';
import { TelegramClient } from 'telegram';

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
      let lastMessageFromId: string | undefined;
      let lastMessageToId: string | undefined;
      if (lastMessage?.fromId && lastMessage.fromId.className === 'PeerUser') {
        lastMessageFromId = lastMessage?.fromId?.userId?.toString();
      }
      if (lastMessage?.toId && lastMessage.toId.className === 'PeerUser') {
        lastMessageToId = lastMessage?.toId?.userId?.toString();
      }

      return <DialogEntity>{
        messengerId: this.messengerId,
        pinned: dialog.pinned,
        archived: dialog.archived,
        message: {
          messengerId: this.messengerId,
          id: lastMessage?.id,
          out: lastMessage?.out,
          date: lastMessage?.date,
          fromId: lastMessageFromId,
          toId: lastMessageToId,
          messageText: lastMessage?.message,
          media: lastMessageMedia,
          replyTo: lastMessage?.replyTo,
          action: lastMessage?.action,
          entities: lastMessage?.entities,
          views: lastMessage?.views,
          editDate: lastMessage?.editDate,
          groupedId: lastMessage?.groupedId,
          postAuthor: lastMessage?.postAuthor,
          ttlPeriod: lastMessage?.ttlPeriod,
        },
        date: dialog.date,
        id: dialog?.id?.toString(),
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

  onMessageReceived(newMessage: LastMessageEntity): void {
    // TODO: Implement this method
    throw new Error('Method not implemented.');
  }
}
