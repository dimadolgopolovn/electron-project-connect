import { LastMessageEntity } from '../entities/dialog_entities';

export class NotificationsRepository {
  /**
   * Show a notification with the given message.
   * @param message The message to show in the notification.
   * @param silent Whether the notification should be silent or not.
   * @returns void
   * @example
   */
  showNotification(message: LastMessageEntity, silent = false): void {
    const NOTIFICATION_TITLE = message.postAuthor || 'New message';
    const NOTIFICATION_BODY = message.messageText;
    let iconUrl: string | undefined;
    switch (message.messengerId) {
      case 'telegram':
        iconUrl =
          'https://upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.svg'; //TODO: change this
        break;

      case 'whatsapp':
        iconUrl =
          'https://upload.wikimedia.org/wikipedia/commons/5/5e/WhatsApp_icon.png'; //TODO: change this
        break;
    }
    new window.Notification(NOTIFICATION_TITLE, {
      body: NOTIFICATION_BODY,
      data: message,
      silent,
      icon: iconUrl,
    }).onclick = () => {};
  }
}
