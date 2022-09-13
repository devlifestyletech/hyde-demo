/* eslint-disable import/no-anonymous-default-export */
import axios from 'axios';
import { encryptStorage } from '../utils/encryptStorage';
require('dotenv').config();

const ExtraApiUrl = 'https://hyde-accounts.ap.ngrok.io';
export default {
  signIn: async function (value) {
    try {
      return await axios.post(`${ExtraApiUrl}/api/v1/property/auth`, value);
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  registration: async function (value, apt, aptName) {
    const session = await encryptStorage.getItem('user_session');
    let newValue = {
      ...value,
      ...session,
      Building: 'Hyde Heritage',
      Apt: apt,
      AptName: aptName,
    };
    try {
      return await axios.post(
        `${ExtraApiUrl}/api/v1/property/adduser`,
        newValue,
        {
          headers: { Authorization: 'Bearer ' + session.jwt },
        }
      );
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  getAllResident: async function () {
    const session = await encryptStorage.getItem('user_session');
    try {
      return await axios.get(
        `${process.env.REACT_APP_API_URL}/users?role_eq=61b40d9a268f0d019c9c0e7e`,
        {
          headers: { Authorization: 'Bearer ' + session.jwt },
        }
      );
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  getAllFixing: async function () {
    const session = await encryptStorage.getItem('user_session');

    try {
      return await axios.get(
        `${process.env.REACT_APP_API_URL}/fixing-reports`,
        {
          headers: { Authorization: 'Bearer ' + session.jwt },
        }
      );
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  signOut: async function () {
    try {
      encryptStorage.removeItem('user_session');
      window.location.href = '/';
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  deleteUser: async function (id) {
    const session = await encryptStorage.getItem('user_session');

    try {
      return await axios.delete(
        `${process.env.REACT_APP_API_URL}/users/${id}`,
        {
          headers: { Authorization: 'Bearer ' + session.jwt },
        }
      );
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  getUserData: async function (id) {
    const session = await encryptStorage.getItem('user_session');

    try {
      return await axios.get(`${process.env.REACT_APP_API_URL}/users/${id}`, {
        headers: { Authorization: 'Bearer ' + session.jwt },
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  editUserData: async function (id, value) {
    const session = await encryptStorage.getItem('user_session');
    try {
      return await axios.put(
        `${process.env.REACT_APP_API_URL}/users/${id}`,
        value,
        {
          headers: { Authorization: 'Bearer ' + session.jwt },
        }
      );
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  addUserToAddress: async function (value) {
    const session = await encryptStorage.getItem('user_session');
    try {
      return await axios.post(
        `${process.env.REACT_APP_API_URL}/resident-lists`,
        value,
        {
          headers: {
            Authorization: 'Bearer ' + session.jwt,
          },
        }
      );
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  forgotPassword: function (value) {
    try {
      return axios.post(
        `${process.env.REACT_APP_API_URL}/auth/forgot-password`,
        value
      );
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  resetPassword: function (value) {
    try {
      return axios.post(
        `${process.env.REACT_APP_API_URL}/auth/reset-password`,
        value
      );
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  deleteImage: async function (id) {
    const session = await encryptStorage.getItem('user_session');
    try {
      return await axios.delete(
        `${process.env.REACT_APP_API_URL}/upload/files/${id}`,
        {
          headers: {
            Authorization: 'Bearer ' + session.jwt,
          },
        }
      );
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  registrationFCMToken: async function (value) {
    console.log('log process', process.env.NOTI_DEV_SERVER);
    try {
      return await axios.post(
        `https://noti-dev.ap.ngrok.io/api/message/admin/registration`,
        value
      );
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  subscribeFCMToken: async function (value) {
    try {
      return await axios.post(
        `https://noti-dev.ap.ngrok.io/api/message/topics/subscribe`,
        value
      );
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  unsubscribeFCMToken: async function (value) {
    try {
      return await axios.post(
        `https://noti-dev.ap.ngrok.io/api/message/topics/unsubscribe`,
        value
      );
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
};
