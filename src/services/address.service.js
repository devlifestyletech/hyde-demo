/* eslint-disable import/no-anonymous-default-export */
import axios from 'axios';
import { encryptStorage } from '../utils/encryptStorage';

export default {
  getAllAddresses: async function () {
    const session = await encryptStorage.getItem('user_session');
    try {
      return await axios.get(
        `${process.env.REACT_APP_API_URL}/addresses/?_limit=500`,
        {
          headers: { Authorization: 'Bearer ' + session.jwt },
        }
      );
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
};
