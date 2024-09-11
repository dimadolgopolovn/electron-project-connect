"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Completer = void 0;
class Completer {
    promise;
    complete = () => { };
    completed = false;
    constructor() {
        this.promise = new Promise((resolve) => {
            this.complete = resolve;
        });
        this.promise.then(() => {
            this.completed = true;
        });
    }
}
exports.Completer = Completer;
