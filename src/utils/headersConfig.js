import { encryptStorage } from './encryptStorage';

export const headersConfig = async () => {
  const session = await encryptStorage.getItem('user_session');
  return {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.jwt}`,
    },
  };
};
