import axios from 'axios';
import { encryptStorage } from '../../../utils/encryptStorage';

export async function getAllJuristic() {
  const { jwt } = await encryptStorage.getItem('user_session');
  try {
    return await axios.get(
      `${process.env.REACT_APP_API_URL}/users?role_ne=61b40d9a268f0d019c9c0e7e`,
      {
        headers: { Authorization: 'Bearer ' + jwt },
      }
    );
  } catch (e) {
    return new Error({ error: e });
  }
}
