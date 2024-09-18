import { Api, TelegramClient } from 'telegram';
import { Entity } from 'telegram/define';
import { Dialog } from 'telegram/tl/custom/dialog';
import {
  LastMessageEntity,
  TypeMessageMediaEntity,
} from '../../common/entities/dialog_entities';
import { DialogEntity } from '../../common/entities/dialog_list_entities';

export class TelegramConverters {
  static toLastMessageEntity = (
    lastMessage: Api.Message,
    dialogId?: bigInt.BigInteger,
  ): LastMessageEntity => {
    const messengerId = 'telegram';
    let telegramMedia = lastMessage?.media;
    let lastMessageMedia: TypeMessageMediaEntity | undefined;
    if (telegramMedia && telegramMedia.className === 'MessageMediaPhoto') {
      lastMessageMedia = {
        spoiler: telegramMedia.spoiler,
        url: telegramMedia.photo?.id, // TODO (gicha): implement this with the correct value
      };
    }
    let resolvedDialogId = (dialogId ?? lastMessage.chatId)?.toString();
    return <LastMessageEntity>{
      messengerId: messengerId,
      id: lastMessage.id.toString(),
      nativeId: lastMessage.id,
      date: lastMessage.date,
      dialogId: resolvedDialogId,
      messageText: lastMessage.message,
      media: lastMessageMedia,
      views: lastMessage.views,
      postAuthor: lastMessage.postAuthor,
      silent: lastMessage.silent,
    };
  };

  static dialogPhotoPromise = async (
    client: TelegramClient,
    entity: Entity | undefined,
  ): Promise<string | undefined> => {
    const photoFile = await client.downloadProfilePhoto(entity!);
    if (typeof photoFile === 'string') return photoFile;
    return photoFile?.toString('base64');
  };

  static toDialogEntity = (
    client: TelegramClient,
    dialog: Dialog,
  ): DialogEntity => {
    const lastMessage = dialog.message;
    let chatPhoto = TelegramConverters.dialogPhotoPromise(
      client,
      dialog.entity,
    );
    return <DialogEntity>{
      messengerId: 'telegram',
      id: dialog?.id?.toString(),
      nativeId: dialog.id,
      pinned: dialog.pinned,
      archived: dialog.archived,
      message:
        lastMessage === undefined
          ? undefined
          : TelegramConverters.toLastMessageEntity(lastMessage, dialog.id),
      date: dialog.date,

      name: dialog?.name,
      title: dialog?.title,
      unreadCount: dialog.unreadCount,
      unreadMentionsCount: dialog.unreadMentionsCount,
      isUser: dialog.isUser,
      isGroup: dialog.isGroup,
      isChannel: dialog.isChannel,
      photoBase64: chatPhoto,
      nativeChatObject: dialog,
    };
  };
}
