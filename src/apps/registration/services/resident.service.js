/* eslint-disable import/no-anonymous-default-export */
import axios from 'axios';
import { encryptStorage } from '../../../utils/encryptStorage';

export default {
  getAllUsers: async function () {
    const session = await encryptStorage.getItem('user_session');
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_URL}/users`,
        {
          headers: {
            Authorization: 'Bearer ' + session.jwt,
          },
        }
      );
      if (data) {
        let d = [];
        data
          .filter((user) => user.role.type === 'resident')
          .forEach((user, index) => {
            let newData = {
              key: index,
              number: index + 1,
              ...user,
            };
            d.push(newData);
          });
        return d;
      }
    } catch (e) {
      console.error(e);
      throw e;
    }
  },

  deleteUser: async function (id) {
    const session = await encryptStorage.getItem('user_session');
    try {
      return await axios.delete(
        `${process.env.REACT_APP_API_URL}/users/${id}`,
        {
          headers: {
            Authorization: 'Bearer ' + session.jwt,
          },
        }
      );
    } catch (e) {
      console.error(e);
      throw e;
    }
  },

  getAddress: async function () {
    const session = await encryptStorage.getItem('user_session');
    try {
      return await axios.get(`${process.env.REACT_APP_API_URL}/projects`, {
        headers: {
          Authorization: 'Bearer ' + session.jwt,
        },
      });
    } catch (e) {
      console.error(e);
      throw e;
    }
  },

  getUserData: async function (id) {
    const session = await encryptStorage.getItem('user_session');
    try {
      return await axios.get(`${process.env.REACT_APP_API_URL}/users/${id}`, {
        headers: {
          Authorization: 'Bearer ' + session.jwt,
        },
      });
    } catch (error) {
      console.error(error);
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

  removeUserFromAddress: async function (id) {
    const session = await encryptStorage.getItem('user_session');
    try {
      return await axios.delete(
        `${process.env.REACT_APP_API_URL}/resident-lists/${id}`,
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
  changeRoleUser: async function (value, id) {
    const session = await encryptStorage.getItem('user_session');
    try {
      return await axios.put(
        `${process.env.REACT_APP_API_URL}/resident-lists/${id}`,
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
};
