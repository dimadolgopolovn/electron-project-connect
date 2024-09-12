import React, { useEffect, useState } from 'react';
import QRCode from 'react-qr-code';
import { atom, useRecoilState } from 'recoil';
import { AuthState } from '../../../modules/common/enums/auth_state';
import { WhatsappChatModule } from '../../../modules/whatsapp/whatsapp-chat-module';

export const whatsappAuthState = atom({
  key: 'whatsappAuthState',
  default: AuthState.INIT,
});

export const WhatsappLogin: React.FC<{
  module: WhatsappChatModule;
}> = ({ module }) => {
  const [authState, setAuthState] = useRecoilState(whatsappAuthState);
  const [qr, setQr] = useState<string>('');

  useEffect(() => {
    module.authQr.promise.then((qr) => {
      setQr(qr);
      setAuthState(AuthState.SIGNING_IN);
    });
    module.onAuthComplete.promise.then(() => {
      setAuthState(AuthState.HAS_SESSION);
    });
  }, []);

  return (
    <div>
      {authState === AuthState.INIT && <span>WhatsApp initing</span>}
      {authState === AuthState.SIGNING_IN && (
        <div
          style={{
            height: 'auto',
            margin: '0 auto',
            maxWidth: 64,
            width: '100%',
          }}
        >
          <QRCode
            size={256}
            style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
            value={qr}
            viewBox={`0 0 256 256`}
          />
        </div>
      )}
      {authState === AuthState.HAS_SESSION && <span>Logged in WA</span>}
    </div>
  );
};
