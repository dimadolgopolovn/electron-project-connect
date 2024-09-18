import { DialogsRepository } from './repositories/dialogs_repository';
import { Completer } from './utils/completer';

/**
 * Abstract class representing a chat module.
 * This class serves as a blueprint for creating chat modules with specific implementations.
 */
export abstract class ChatModule {
  /**
   * The unique identifier for the messenger.
   */
  abstract messengerId: string;

  /**
   * The repository for managing dialogs.
   */
  abstract dialogsRepository: DialogsRepository;

  /**
   * Event triggered when authentication is complete.
   */
  abstract get onAuthComplete(): Completer<void>;
  /**
   * Initializes the chat module. Call this method after `onAuthComplete` is resolved.
   * @returns A promise that resolves when the initialization is complete.
   */
  abstract init(): Promise<void>;

  /**
   * Checks if the user is signed in.
   * @returns A promise that resolves when the check is complete.
   */
  abstract checkSignedIn(): Promise<void>;
}
