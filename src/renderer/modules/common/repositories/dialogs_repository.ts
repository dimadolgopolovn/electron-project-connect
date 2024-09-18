import { LastMessageEntity } from '../entities/dialog_entities';
import {
  DialogEntity,
  GetDialogsRequest,
} from '../entities/dialog_list_entities';

/**
 * Abstract class representing a repository for managing dialogs.
 * Provides methods to get a list of dialogs and handle new messages.
 */
export abstract class DialogsRepository {
  /**n   * Retrieves a list of dialogs based on the provided request.
   * @param request - The request object containing parameters for fetching dialogs.
   * @returns A promise that resolves to an array of DialogEntity objects.
   */
  abstract getDialogsList(request: GetDialogsRequest): Promise<DialogEntity[]>;
  /**
   * Registers a callback function to handle new messages.
   *
   * @param callback - The function to be called when a new message is received.
   */
  abstract addNewMessageHandler(
    callback: (event: LastMessageEntity) => void,
  ): void;

  /**
   * Unregister a previously registered callback function for new messages.
   *
   * @param callback - The function to be removed from the new message handlers.
   */
  abstract removeNewMessageHandler(
    callback: (event: LastMessageEntity) => void,
  ): void;
}
