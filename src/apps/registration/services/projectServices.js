/* eslint-disable import/no-anonymous-default-export */
import axios from 'axios';
import { encryptStorage } from '../../../utils/encryptStorage';

export default {
  getProjectList: async function () {
    const session = encryptStorage.getItem('user_session');
    try {
      return await axios.get(`${process.env.REACT_APP_API_URL}/projects`, {
        headers: {
          Authorization: 'Bearer ' + session.jwt,
        },
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  deleteProject: async function (id) {
    const session = encryptStorage.getItem('user_session');
    try {
      return await axios.delete(
        `${process.env.REACT_APP_API_URL}/projects/${id}`,
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
  getProjectData: async function (id) {
    const session = encryptStorage.getItem('user_session');
    try {
      return await axios.get(
        `${process.env.REACT_APP_API_URL}/projects/${id}`,
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
  getResidences: async function (search) {
    const session = encryptStorage.getItem('user_session');
    try {
      return await axios.get(
        search
          ? `${process.env.REACT_APP_API_URL}/addresses?_where[0][createdAt_gte]=2022-08-20T05:00:00.000Z&address_number_contains=${search}&_limit=500`
          : `${process.env.REACT_APP_API_URL}/addresses?_where[0][createdAt_gte]=2022-08-20T05:00:00.000Z&_limit=500`,
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
  getResidencesBySearch: async function (search) {
    const session = encryptStorage.getItem('user_session');
    try {
      return await axios.get(
        `${process.env.REACT_APP_API_URL}/addresses?address_number_contains=${search}`,
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
  createProject: async function (value) {
    const session = encryptStorage.getItem('user_session');
    try {
      return await axios.post(
        `${process.env.REACT_APP_API_URL}/projects`,
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
  editProject: async function (value, id) {
    const session = encryptStorage.getItem('user_session');
    try {
      return await axios.put(
        `${process.env.REACT_APP_API_URL}/projects/${id}`,
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
  getZoneById: async function () {
    const session = encryptStorage.getItem('user_session');
    try {
      return await axios.get(`${process.env.REACT_APP_API_URL}/floors`, {
        headers: {
          Authorization: 'Bearer ' + session.jwt,
        },
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  createProjectZone: async function (value) {
    const session = encryptStorage.getItem('user_session');
    try {
      return await axios.post(
        `${process.env.REACT_APP_API_URL}/floors`,
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
  getResidencesByZoneId: async function (zoneId) {
    const session = encryptStorage.getItem('user_session');
    try {
      return await axios.get(
        `${process.env.REACT_APP_API_URL}/addresses?_where[building_zone]=${zoneId}`,
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
  createRoom: async function (value) {
    const session = encryptStorage.getItem('user_session');
    try {
      return await axios.post(
        `${process.env.REACT_APP_API_URL}/addresses`,
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
  deleteRoom: async function (id) {
    const session = encryptStorage.getItem('user_session');
    try {
      return await axios.delete(
        `${process.env.REACT_APP_API_URL}/addresses/${id}`,
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
  deleteZone: async function (id) {
    const session = encryptStorage.getItem('user_session');
    try {
      return await axios.delete(
        `${process.env.REACT_APP_API_URL}/floors/${id}`,
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
  editZoneName: async function (value, id) {
    const session = encryptStorage.getItem('user_session');
    try {
      return await axios.put(
        `${process.env.REACT_APP_API_URL}/floors/${id}`,
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
