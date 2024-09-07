import { DialogsRepository } from './repositories/dialogs_repository';
import { Completer } from './utils/completer';
export declare abstract class ChatModule {
    abstract messengerId: string;
    abstract dialogsRepository: DialogsRepository;
    abstract get onAuthComplete(): Completer<void>;
    abstract init(): Promise<void>;
    abstract checkSignedIn(): Promise<void>;
}
