import { EncryptStorage } from 'encrypt-storage';
require('dotenv').config();

export const encryptStorage = new EncryptStorage(
	process.env.REACT_APP_SECRET_KEY,
	{
		prefix: '@hyde',
	}
);