/* eslint-disable import/no-anonymous-default-export */
import axios from 'axios';
import { encryptStorage } from '../utils/encryptStorage';

export default {
  getAllAddresses: async function () {
    const { jwt } = await encryptStorage.getItem('user_session');
    try {
      return await axios.get(
        `${process.env.REACT_APP_API_URL}/addresses/?_limit=500`,
        { headers: { Authorization: 'Bearer ' + jwt } }
      );
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  postAddress: async function (values) {
    const session = await encryptStorage.getItem('user_session');
    const headers = {
      headers: { Authorization: 'Bearer ' + session.jwt },
    };
    try {
      console.log(values);
      return axios.post(
        `${process.env.REACT_APP_API_URL}/addresses`,
        values,
        headers
      );
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
};
