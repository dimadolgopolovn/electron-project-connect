export declare class Completer<T> {
    readonly promise: Promise<T>;
    complete: (value: PromiseLike<T> | T) => void;
    completed: boolean;
    constructor();
}
