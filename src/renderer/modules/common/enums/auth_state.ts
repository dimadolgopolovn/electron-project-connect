/**
 * Enum representing the different states of authentication.
 *
 * @enum {number}
 * @property {number} INIT - Initial state before any authentication action has taken place.
 * @property {number} SIGNING_IN - State when the user is in the process of signing in.
 * @property {number} HAS_SESSION - State when the user has an active session.
 */
export enum AuthState {
  INIT,
  SIGNING_IN,
  HAS_SESSION,
}
