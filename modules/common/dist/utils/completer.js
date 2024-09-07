"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Completer = void 0;
var Completer = /** @class */ (function () {
    function Completer() {
        var _this = this;
        this.complete = function () { };
        this.completed = false;
        this.promise = new Promise(function (resolve) {
            _this.complete = resolve;
        });
        this.promise.then(function () {
            _this.completed = true;
        });
    }
    return Completer;
}());
exports.Completer = Completer;
