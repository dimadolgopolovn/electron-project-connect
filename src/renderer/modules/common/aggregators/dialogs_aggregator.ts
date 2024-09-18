import { ChatModule } from '../chat_module';
import { LastMessageEntity } from '../entities/dialog_entities';
import {
  DialogEntity,
  GetDialogsRequest,
} from '../entities/dialog_list_entities';
import { NotificationsRepository } from '../notifications/notifications_repository';

/**
 * Class that aggregates all chat modules and provides a single interface to interact with them.
 * It also handles new message notifications and dispatches them to the appropriate modules.
 * @param modules - An array of chat modules to aggregate.
 * @example
 * const dialogAggregator = new DialogAggregator([telegramModule, whatsappModule]);
 * dialogAggregator.init();
 * dialogAggregator.getDialogsList({ limit: 10 }).then((dialogs) => console.log(dialogs));
 * dialogAggregator.addNewMessageHandler((message) => console.log(message));
 * @category Aggregators
 */
export class DialogAggregator {
  constructor(modules: ChatModule[]) {
    this.modules = modules;
    this.notifications = new NotificationsRepository();
  }

  modules: ChatModule[];
  notifications: NotificationsRepository;

  private newMessageCallbacks: Array<(event: LastMessageEntity) => void> = [];

  async init(): Promise<void> {
    await Promise.all(this.modules.map((module) => this.initModule(module)));
  }

  /**
   * Initializes a chat module and waits for the authentication to complete.
   * @param module - The chat module to initialize
   */
  private async initModule(module: ChatModule): Promise<void> {
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

  /**
   * Retrieves a list of dialogs from all chat modules.
   * @param request - The request object containing parameters for fetching dialogs.
   * @returns A promise that resolves to an array of DialogEntity objects.
   */
  async getDialogsList(request: GetDialogsRequest): Promise<DialogEntity[]> {
    const dialogs = await Promise.all(
      this.modules
        .filter((module) => module.onAuthComplete.completed !== false)
        .map((module) => module.dialogsRepository.getDialogsList(request)),
    );
    return dialogs.flat().sort((a, b) => b.date - a.date);
  }

  /**
   * Adds a new message handler to the list of callbacks.
   * This function is called with an event of type `LastMessageEntity`.
   * @param callback - The callback function to be added.
   */
  addNewMessageHandler(callback: (event: LastMessageEntity) => void): void {
    this.newMessageCallbacks.push(callback);
  }
  /**
   * Removes a callback function from the list of new message handlers.
   *
   * @param callback - The callback function to be removed. This function is called with an event of type `LastMessageEntity`.
   */
  removeNewMessageHandler(callback: (event: LastMessageEntity) => void): void {
    this.newMessageCallbacks = this.newMessageCallbacks.filter(
      (cb) => cb !== callback,
    );
  }
}
