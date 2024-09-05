import {
  DialogEntity,
  LastMessageEntity,
  TypeMessageMediaEntity,
  UnifiedObjectId,
} from 'chat-module';
import { Api } from 'telegram';
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
  let dialogId: UnifiedObjectId | undefined;
  switch (lastMessage.peerId.className) {
    case 'PeerUser':
      dialogId = lastMessage.peerId.userId.toString();
      break;
    case 'PeerChat':
      dialogId = lastMessage.peerId.chatId.toString();
      break;
    case 'PeerChannel':
      dialogId = lastMessage.peerId.channelId.toString();
      break;
  }
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

export const toDialogEntity = (dialog: Dialog): DialogEntity => {
  const lastMessage = dialog.message;
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
  };
};
