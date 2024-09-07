export class Completer<T> {
  public readonly promise: Promise<T>;
  public complete: (value: PromiseLike<T> | T) => void = () => {};
  public completed: boolean = false;

  public constructor() {
    this.promise = new Promise<T>((resolve) => {
      this.complete = resolve;
    });
    this.promise.then(() => {
      this.completed = true;
    });
  }
}
