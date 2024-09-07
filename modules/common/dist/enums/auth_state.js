"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthState = void 0;
var AuthState;
(function (AuthState) {
    AuthState[AuthState["INIT"] = 0] = "INIT";
    AuthState[AuthState["SIGNING_IN"] = 1] = "SIGNING_IN";
    AuthState[AuthState["HAS_SESSION"] = 2] = "HAS_SESSION";
})(AuthState || (exports.AuthState = AuthState = {}));
