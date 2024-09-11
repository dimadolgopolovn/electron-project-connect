"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DialogAggregator = void 0;
class DialogAggregator {
    constructor(modules) {
        this.modules = modules;
    }
    modules;
    async getDialogsList(request) {
        const dialogs = await Promise.all(this.modules
            .filter((module) => module.onAuthComplete.completed !== false)
            .map((module) => module.dialogsRepository.getDialogsList(request)));
        return dialogs.flat();
    }
}
exports.DialogAggregator = DialogAggregator;
