import {
  DialogEntity,
  LastMessageEntity,
  TypeMessageMediaEntity,
} from 'chat-module';
import { Api, TelegramClient } from 'telegram';
import { Entity } from 'telegram/define';
import { Dialog } from 'telegram/tl/custom/dialog';

export const toLastMessageEntity = (
  lastMessage: Api.Message,
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
  let dialogId = lastMessage.chatId?.toString();
  return <LastMessageEntity>{
    messengerId: messengerId,
    id: lastMessage?.id.toString(),
    date: lastMessage?.date,
    dialogId: dialogId,
    messageText: lastMessage?.message,
    media: lastMessageMedia,
    views: lastMessage?.views,
    postAuthor: lastMessage?.postAuthor,
  };
};

const dialogPhotoPromise = async (
  client: TelegramClient,
  entity: Entity | undefined,
): Promise<string | undefined> => {
  const photoFile = await client.downloadProfilePhoto(entity!);
  if (typeof photoFile === 'string') return photoFile;
  return photoFile?.toString('base64');
};

export const toDialogEntity = (
  client: TelegramClient,
  dialog: Dialog,
): DialogEntity => {
  const lastMessage = dialog.message;
  console.log('dialog', dialog);
  let chatPhoto = dialogPhotoPromise(client, dialog.entity);
  console.log('chatPhoto', chatPhoto);
  return <DialogEntity>{
    messengerId: 'telegram',
    pinned: dialog.pinned,
    archived: dialog.archived,
    message:
      lastMessage === undefined ? undefined : toLastMessageEntity(lastMessage),
    date: dialog.date,
    id: dialog?.id?.toString(),
    name: dialog?.name,
    title: dialog?.title,
    unreadCount: dialog.unreadCount,
    unreadMentionsCount: dialog.unreadMentionsCount,
    isUser: dialog.isUser,
    isGroup: dialog.isGroup,
    isChannel: dialog.isChannel,
    photoBase64: chatPhoto,
  };
};
