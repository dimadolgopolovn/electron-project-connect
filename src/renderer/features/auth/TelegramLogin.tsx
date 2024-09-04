import { useEffect, useState } from 'react';
import { atom, useRecoilState } from 'recoil';
import { TelegramAuthRepository } from 'telegram-chat-module';
import { Completer } from '../../../utils/completer';
import { TelegramAuthState } from './enums/telegram_auth_state';
import { TelegramAuthStep } from './enums/telegram_auth_step';

export const telegramAuthState = atom({
  key: 'telegramAuthState',
  default: TelegramAuthState.INIT,
});

let phoneCompleter: Completer<string> = new Completer<string>();
let passwordCompleter: Completer<string> = new Completer<string>();
let codeCompleter: Completer<string> = new Completer<string>();

export const TelegramLogin: React.FC<{
  authRepository: TelegramAuthRepository;
}> = ({ authRepository }) => {
  // idk how connect user input to promise, used Completer pattern
  const [authState, setAuthState] = useRecoilState(telegramAuthState);
  const [authStep, setAuthStep] = useState(TelegramAuthStep.PHONE);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');

  const initTelegramCallback = async () => {
    await authRepository.init();
    if (authRepository.hasSession) {
      setAuthState(TelegramAuthState.HAS_SESSION);
    } else {
      setAuthState(TelegramAuthState.SIGNING_IN);
      await authRepository.signIn({
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
      if (authRepository.hasSession) {
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
              await authRepository.logout();
              setAuthState(TelegramAuthState.INIT);
            }}
          >
            Logout
          </button>
        </>
      )}
    </div>
  );
};
