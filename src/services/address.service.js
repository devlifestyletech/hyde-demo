/* eslint-disable import/no-anonymous-default-export */
import axios from 'axios';
import { headersConfig } from '../utils/headersConfig';

export default {
  getAllAddresses: async function () {
    const headers = await headersConfig();
    try {
      return await axios.get(
        `${process.env.REACT_APP_API_URL}/addresses/?_limit=500`,
        headers
      );
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
};
