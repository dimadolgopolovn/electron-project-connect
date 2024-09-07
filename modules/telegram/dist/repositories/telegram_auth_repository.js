"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelegramAuthRepository = void 0;
var chat_module_1 = require("chat-module");
var TelegramAuthRepository = /** @class */ (function () {
    function TelegramAuthRepository(_a) {
        var telegramClient = _a.telegramClient;
        this.ready = new chat_module_1.Completer();
        this.telegramClient = telegramClient;
    }
    Object.defineProperty(TelegramAuthRepository.prototype, "hasSession", {
        get: function () {
            return this.telegramClient.session.authKey !== undefined;
        },
        enumerable: false,
        configurable: true
    });
    TelegramAuthRepository.prototype.fetchSession = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.telegramClient.session.load()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    TelegramAuthRepository.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.telegramClient.onError = function (err) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                console.log(err);
                                return [2 /*return*/];
                            });
                        }); };
                        return [4 /*yield*/, this.fetchSession()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    TelegramAuthRepository.prototype.signIn = function (_a) {
        var phoneProvider = _a.phoneProvider, passwordProvider = _a.passwordProvider, codeProvider = _a.codeProvider;
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.telegramClient.start({
                            phoneNumber: phoneProvider,
                            password: passwordProvider,
                            phoneCode: codeProvider,
                            onError: function (err) {
                                console.log(err);
                                throw err;
                            },
                        })];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, this.telegramClient.connect()];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, this.fetchSession()];
                    case 3:
                        _b.sent();
                        this.ready.complete();
                        console.log('You should now be connected.');
                        console.log(this.telegramClient.session.save()); // Save this string to avoid logging in again
                        return [2 /*return*/];
                }
            });
        });
    };
    TelegramAuthRepository.prototype.getMyUser = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.telegramClient.getMe()];
            });
        });
    };
    TelegramAuthRepository.prototype.logout = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.telegramClient.disconnect()];
                    case 1:
                        _a.sent();
                        this.telegramClient.session.setAuthKey(undefined);
                        this.telegramClient.session.save();
                        return [2 /*return*/];
                }
            });
        });
    };
    return TelegramAuthRepository;
}());
exports.TelegramAuthRepository = TelegramAuthRepository;
