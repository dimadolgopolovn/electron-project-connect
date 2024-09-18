import { ChatModule } from '../chat_module';
import { LastMessageEntity } from '../entities/dialog_entities';
import {
  DialogEntity,
  GetDialogsRequest,
} from '../entities/dialog_list_entities';
import { NotificationsRepository } from '../notifications/notifications_repository';

export class DialogAggregator {
  constructor(modules: ChatModule[]) {
    this.modules = modules;
    this.notifications = new NotificationsRepository();
  }

  modules: ChatModule[];
  notifications: NotificationsRepository;

  private newMessageCallbacks: Array<(event: LastMessageEntity) => void> = [];

  async init(): Promise<void> {
    for (const module of this.modules) {
      await module.onAuthComplete.promise;
      await module.init();
      module.dialogsRepository.addNewMessageHandler(
        (message: LastMessageEntity) => {
          console.log('New message', message);
          if (!message.silent) {
            this.notifications.showNotification(message);
          }
          this.newMessageCallbacks.forEach((cb) => cb(message));
        },
      );
    }
  }

  async getDialogsList(request: GetDialogsRequest): Promise<DialogEntity[]> {
    const dialogs = await Promise.all(
      this.modules
        .filter((module) => module.onAuthComplete.completed !== false)
        .map((module) => module.dialogsRepository.getDialogsList(request)),
    );
    return dialogs.flat().sort((a, b) => b.date - a.date);
  }

  addNewMessageHandler(callback: (event: LastMessageEntity) => void): void {
    this.newMessageCallbacks.push(callback);
  }
  removeNewMessageHandler(callback: (event: LastMessageEntity) => void): void {
    this.newMessageCallbacks = this.newMessageCallbacks.filter(
      (cb) => cb !== callback,
    );
  }
}
