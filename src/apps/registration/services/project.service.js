/* eslint-disable import/no-anonymous-default-export */
import axios from "axios";
import { encryptStorage } from "../../../utils/encryptStorage";
const session = encryptStorage.getItem("user_session");

export default {
  getProjectList: async function () {
    try {
      return axios.get(`${process.env.REACT_APP_API_URL}/projects`, {
        headers: {
          Authorization: "Bearer " + session.jwt,
        },
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  deleteProject: async function (id) {
    try {
      return axios.delete(`${process.env.REACT_APP_API_URL}/projects/${id}`, {
        headers: {
          Authorization: "Bearer " + session.jwt,
        },
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  getProjectData: async function (id) {
    try {
      return axios.get(`${process.env.REACT_APP_API_URL}/projects/${id}`, {
        headers: {
          Authorization: "Bearer " + session.jwt,
        },
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  getResidences: async function () {
    try {
      return axios.get(
        `${process.env.REACT_APP_API_URL}/addresses/?_limit=500`,
        {
          headers: {
            Authorization: "Bearer " + session.jwt,
          },
        }
      );
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  createProject: async function (value) {
    try {
      return await axios.post(
        `${process.env.REACT_APP_API_URL}/projects`,
        value,
        {
          headers: {
            Authorization: "Bearer " + session.jwt,
          },
        }
      );
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  editProject: async function (value, id) {
    try {
      return await axios.put(
        `${process.env.REACT_APP_API_URL}/projects/${id}`,
        value,
        {
          headers: {
            Authorization: "Bearer " + session.jwt,
          },
        }
      );
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  getZoneById: async function () {
    try {
      return await axios.get(`${process.env.REACT_APP_API_URL}/floors`, {
        headers: {
          Authorization: "Bearer " + session.jwt,
        },
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  createProjectZone: async function (value) {
    try {
      return await axios.post(
        `${process.env.REACT_APP_API_URL}/floors`,
        value,
        {
          headers: {
            Authorization: "Bearer " + session.jwt,
          },
        }
      );
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  getResidentListByResidenceId: async function (id) {
    try {
      return await axios.get(
        `${process.env.REACT_APP_API_URL}/resident-lists?_where[address]=${id}`,
        {
          headers: {
            Authorization: "Bearer " + session.jwt,
          },
        }
      );
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  getResidencesByZoneId: async function (zoneId) {
    try {
      return await axios.get(
        `${process.env.REACT_APP_API_URL}/addresses?_where[building_zone]=${zoneId}`,
        {
          headers: {
            Authorization: "Bearer " + session.jwt,
          },
        }
      );
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  createRoom: async function (value) {
    try {
      return await axios.post(
        `${process.env.REACT_APP_API_URL}/addresses`,
        value,
        {
          headers: {
            Authorization: "Bearer " + session.jwt,
          },
        }
      );
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  deleteRoom: async function (id) {
    try {
      return await axios.delete(
        `${process.env.REACT_APP_API_URL}/addresses/${id}`,
        {
          headers: {
            Authorization: "Bearer " + session.jwt,
          },
        }
      );
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  deleteZone: async function (id) {
    try {
      return await axios.delete(
        `${process.env.REACT_APP_API_URL}/floors/${id}`,
        {
          headers: {
            Authorization: "Bearer " + session.jwt,
          },
        }
      );
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  editZoneName: async function (value, id) {
    try {
      return await axios.put(
        `${process.env.REACT_APP_API_URL}/floors/${id}`,
        value,
        {
          headers: {
            Authorization: "Bearer " + session.jwt,
          },
        }
      );
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
};
