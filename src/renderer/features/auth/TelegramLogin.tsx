import { useEffect, useState } from 'react';
import { atom, useRecoilState } from 'recoil';
import { TelegramClient } from 'telegram';
import { StoreSession } from 'telegram/sessions';
import { TelegramAuthRepositoryImpl } from '../../../data/repositories/auth/telegram_auth_repository_impl';
import { TelegramAuthRepository } from '../../../domain/auth/telegram_auth_repository';
import { Completer } from '../../../utils/completer';
import { TelegramAuthState } from './enums/telegram_auth_state';
import { TelegramAuthStep } from './enums/telegram_auth_step';

export const telegramAuthState = atom({
  key: 'telegramAuthState',
  default: TelegramAuthState.INIT,
});

let telegramClient: TelegramClient;
export function getTelegramClient(): TelegramClient {
  if (telegramClient) return telegramClient;
  const storeSession = new StoreSession('telegram_session');
  const apiId = parseInt(process.env.TELEGRAM_API_ID ?? '');
  const apiHash = process.env.TELEGRAM_API_HASH ?? '';
  return (telegramClient = new TelegramClient(storeSession, apiId, apiHash, {
    connectionRetries: 5,
    useWSS: true,
  }));
}
let phoneCompleter: Completer<string> = new Completer<string>();
let passwordCompleter: Completer<string> = new Completer<string>();
let codeCompleter: Completer<string> = new Completer<string>();

export function TelegramLogin() {
  // idk how connect user input to promise, used Completer pattern

  const [authState, setAuthState] = useRecoilState(telegramAuthState);
  const [authStep, setAuthStep] = useState(TelegramAuthStep.PHONE);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const telegramClient = getTelegramClient();
  const tgAuthRepo: TelegramAuthRepository = new TelegramAuthRepositoryImpl({
    telegramClient: telegramClient,
    phoneProvider: async () => {
      console.log('phoneProvider');
      setAuthStep(TelegramAuthStep.PHONE);
      phoneCompleter = new Completer<string>();
      return phoneCompleter.promise;
    },
    passwordProvider: async () => {
      console.log('passwordProvider');
      setAuthStep(TelegramAuthStep.PASSWORD);
      passwordCompleter = new Completer<string>();
      return passwordCompleter.promise;
    },
    codeProvider: async () => {
      console.log('codeProvider');
      setAuthStep(TelegramAuthStep.CODE);
      codeCompleter = new Completer<string>();
      return codeCompleter.promise;
    },
  });

  const initTelegramCallback = async () => {
    await tgAuthRepo.init();
    if (tgAuthRepo.hasSession) {
      setAuthState(TelegramAuthState.HAS_SESSION);
    } else {
      setAuthState(TelegramAuthState.SIGNING_IN);
      await tgAuthRepo.signIn();
      if (tgAuthRepo.hasSession) {
        setAuthState(TelegramAuthState.HAS_SESSION);
      }
    }
  };

  useEffect(() => {
    if (authState === TelegramAuthState.INIT) {
      initTelegramCallback();
    }
  }, [authState]);

  return (
    <div>
      {authState === TelegramAuthState.INIT && (
        <button onClick={initTelegramCallback}>Init</button>
      )}
      {authState === TelegramAuthState.SIGNING_IN && (
        <>
          {authStep === TelegramAuthStep.PHONE && (
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
          {authStep === TelegramAuthStep.PASSWORD && (
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
          {authStep === TelegramAuthStep.CODE && (
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
          )}{' '}
        </>
      )}

      {authState === TelegramAuthState.HAS_SESSION && (
        <>
          <p>Has session</p>
          <button
            onClick={async () => {
              await tgAuthRepo.logout();
              setAuthState(TelegramAuthState.INIT);
            }}
          >
            Logout
          </button>
        </>
      )}
    </div>
  );
}
