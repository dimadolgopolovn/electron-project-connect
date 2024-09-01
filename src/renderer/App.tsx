import { useState } from 'react';
import { Route, MemoryRouter as Router, Routes } from 'react-router-dom';
import { TelegramAuthRepositoryImpl } from '../data/repositories/auth/telegram_auth_repository_impl';
import { TelegramAuthRepository } from '../domain/auth/telegram_auth_repository';
import './App.css';

// idk how connect user input to promise, used Completer pattern
export class Completer<T> {
  public readonly promise: Promise<T>;
  public complete: (value: PromiseLike<T> | T) => void = () => {};
  private reject: (reason?: any) => void = () => {};

  public constructor() {
    this.promise = new Promise<T>((resolve, reject) => {
      this.complete = resolve;
      this.reject = reject;
    });
  }
}

enum AuthState {
  INIT,
  PHONE,
  PASSWORD,
  CODE,
  HAS_SESSION,
}

let phoneCompleter: Completer<string> = new Completer<string>();
let passwordCompleter: Completer<string> = new Completer<string>();
let codeCompleter: Completer<string> = new Completer<string>();

function TelegramLogin() {
  const [authState, setAuthState] = useState(AuthState.INIT);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  let tgAuthRepo: TelegramAuthRepository = new TelegramAuthRepositoryImpl({
    apiId: parseInt(process.env.TELEGRAM_API_ID ?? ''),
    apiHash: process.env.TELEGRAM_API_HASH ?? '',
    phoneProvider: async () => {
      console.log('phoneProvider');
      setAuthState(AuthState.PHONE);
      phoneCompleter = new Completer<string>();
      return phoneCompleter.promise;
    },
    passwordProvider: async () => {
      console.log('passwordProvider');
      setAuthState(AuthState.PASSWORD);
      passwordCompleter = new Completer<string>();
      return passwordCompleter.promise;
    },
    codeProvider: async () => {
      console.log('codeProvider');
      setAuthState(AuthState.CODE);
      codeCompleter = new Completer<string>();
      return codeCompleter.promise;
    },
  });

  return (
    <div>
      <h1>Telegram Login</h1>
      {authState === AuthState.INIT && (
        <button
          onClick={async () => {
            await tgAuthRepo.logout();
            await tgAuthRepo.init();
            if (tgAuthRepo.hasSession) {
              setAuthState(AuthState.HAS_SESSION);
            } else {
              await tgAuthRepo.signIn();
              if (tgAuthRepo.hasSession) {
                setAuthState(AuthState.HAS_SESSION);
              }
            }
          }}
        >
          Init
        </button>
      )}
      {authState === AuthState.PHONE && (
        <>
          <p>Phone: {phone}</p>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            onKeyUp={(e) => {
              if (e.key === 'Enter') {
                phoneCompleter.complete(phone);
              }
            }}
          />
          <button
            onClick={() => {
              phoneCompleter.complete(phone);
            }}
          >
            Phone
          </button>
        </>
      )}
      {authState === AuthState.PASSWORD && (
        <>
          <p>Password:</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyUp={(e) => {
              if (e.key === 'Enter') {
                passwordCompleter.complete(password);
              }
            }}
          />
          <button
            onClick={() => {
              passwordCompleter.complete(password);
            }}
          >
            Password
          </button>
        </>
      )}
      {authState === AuthState.CODE && (
        <>
          <p>Code: {code}</p>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyUp={(e) => {
              if (e.key === 'Enter') {
                codeCompleter.complete(code);
              }
            }}
          />
          <button
            onClick={() => {
              codeCompleter.complete(code);
            }}
          >
            Code
          </button>
        </>
      )}
      {authState === AuthState.HAS_SESSION && <p>Has session</p>}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TelegramLogin />} />
      </Routes>
    </Router>
  );
}
