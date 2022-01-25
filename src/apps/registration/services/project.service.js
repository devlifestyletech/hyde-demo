/* eslint-disable import/no-anonymous-default-export */
import axios from "axios";
import { encryptStorage } from "../../../utils/encryptStorage";
const session = encryptStorage.getItem("user_session");

export default {
  getProjectList: async function () {
    try {
      return axios.get(`http://13.229.197.2:1337/projects`, {
        headers: {
          Authorization:
            "Bearer " +
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxODRkZWEyYzI2NjJjMDQ5ZWE4NmY5MCIsImlhdCI6MTY0Mjk1ODU2MCwiZXhwIjoxNjQ1NTUwNTYwfQ.zEO4m3l4vyqVoJBlnqcJh3TplHbNZrPZf-zAwuSkvzY",
        },
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  deleteProject: async function (id) {
    try {
      return axios.delete(`http://13.229.197.2:1337/projects/${id}`, {
        headers: {
          Authorization:
            "Bearer " +
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxODRkZWEyYzI2NjJjMDQ5ZWE4NmY5MCIsImlhdCI6MTY0Mjk1ODU2MCwiZXhwIjoxNjQ1NTUwNTYwfQ.zEO4m3l4vyqVoJBlnqcJh3TplHbNZrPZf-zAwuSkvzY",
        },
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  getProjectData: async function (id) {
    try {
      return axios.get(`http://13.229.197.2:1337/projects/${id}`, {
        headers: {
          Authorization:
            "Bearer " +
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxODRkZWEyYzI2NjJjMDQ5ZWE4NmY5MCIsImlhdCI6MTY0Mjk1ODU2MCwiZXhwIjoxNjQ1NTUwNTYwfQ.zEO4m3l4vyqVoJBlnqcJh3TplHbNZrPZf-zAwuSkvzY",
        },
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  getResidences: async function () {
    try {
      return axios.get(`http://13.229.197.2:1337/addresses`, {
        headers: {
          Authorization:
            "Bearer " +
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxODRkZWEyYzI2NjJjMDQ5ZWE4NmY5MCIsImlhdCI6MTY0Mjk1ODU2MCwiZXhwIjoxNjQ1NTUwNTYwfQ.zEO4m3l4vyqVoJBlnqcJh3TplHbNZrPZf-zAwuSkvzY",
        },
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  createProject: async function (value) {
    try {
      return await axios.post(`http://13.229.197.2:1337/projects`, value, {
        headers: {
          Authorization:
            "Bearer " +
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxODRkZWEyYzI2NjJjMDQ5ZWE4NmY5MCIsImlhdCI6MTY0Mjk1ODU2MCwiZXhwIjoxNjQ1NTUwNTYwfQ.zEO4m3l4vyqVoJBlnqcJh3TplHbNZrPZf-zAwuSkvzY",
        },
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  editProject: async function (value, id) {
    try {
      return await axios.put(`http://13.229.197.2:1337/projects/${id}`, value, {
        headers: {
          Authorization:
            "Bearer " +
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxODRkZWEyYzI2NjJjMDQ5ZWE4NmY5MCIsImlhdCI6MTY0Mjk1ODU2MCwiZXhwIjoxNjQ1NTUwNTYwfQ.zEO4m3l4vyqVoJBlnqcJh3TplHbNZrPZf-zAwuSkvzY",
        },
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  getZoneById: async function (id) {
    console.log("service: ", id);
    try {
      return await axios.get(
        `http://13.229.197.2:1337/zones-or-buildings?_where[project]=${id}`,
        {
          headers: {
            Authorization:
              "Bearer " +
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxODRkZWEyYzI2NjJjMDQ5ZWE4NmY5MCIsImlhdCI6MTY0Mjk1ODU2MCwiZXhwIjoxNjQ1NTUwNTYwfQ.zEO4m3l4vyqVoJBlnqcJh3TplHbNZrPZf-zAwuSkvzY",
          },
        }
      );
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  createProjectZone: async function (value) {
    try {
      return await axios.post(
        `http://13.229.197.2:1337/zones-or-buildings`,
        value,
        {
          headers: {
            Authorization:
              "Bearer " +
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxODRkZWEyYzI2NjJjMDQ5ZWE4NmY5MCIsImlhdCI6MTY0Mjk1ODU2MCwiZXhwIjoxNjQ1NTUwNTYwfQ.zEO4m3l4vyqVoJBlnqcJh3TplHbNZrPZf-zAwuSkvzY",
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
        `http://13.229.197.2:1337/resident-lists?_where[residence]=${id}`,
        {
          headers: {
            Authorization:
              "Bearer " +
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxODRkZWEyYzI2NjJjMDQ5ZWE4NmY5MCIsImlhdCI6MTY0Mjk1ODU2MCwiZXhwIjoxNjQ1NTUwNTYwfQ.zEO4m3l4vyqVoJBlnqcJh3TplHbNZrPZf-zAwuSkvzY",
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
        `http://13.229.197.2:1337/addresses?_where[building_zone]=${zoneId}`,
        {
          headers: {
            Authorization:
              "Bearer " +
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxODRkZWEyYzI2NjJjMDQ5ZWE4NmY5MCIsImlhdCI6MTY0Mjk1ODU2MCwiZXhwIjoxNjQ1NTUwNTYwfQ.zEO4m3l4vyqVoJBlnqcJh3TplHbNZrPZf-zAwuSkvzY",
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
      return await axios.post(`http://13.229.197.2:1337/addresses`, value, {
        headers: {
          Authorization:
            "Bearer " +
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxODRkZWEyYzI2NjJjMDQ5ZWE4NmY5MCIsImlhdCI6MTY0Mjk1ODU2MCwiZXhwIjoxNjQ1NTUwNTYwfQ.zEO4m3l4vyqVoJBlnqcJh3TplHbNZrPZf-zAwuSkvzY",
        },
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  deleteRoom: async function (id) {
    try {
      return await axios.delete(`http://13.229.197.2:1337/addresses/${id}`, {
        headers: {
          Authorization:
            "Bearer " +
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxODRkZWEyYzI2NjJjMDQ5ZWE4NmY5MCIsImlhdCI6MTY0Mjk1ODU2MCwiZXhwIjoxNjQ1NTUwNTYwfQ.zEO4m3l4vyqVoJBlnqcJh3TplHbNZrPZf-zAwuSkvzY",
        },
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  deleteZone: async function (id) {
    try {
      return await axios.delete(
        `http://13.229.197.2:1337/zones-or-buildings/${id}`,
        {
          headers: {
            Authorization:
              "Bearer " +
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxODRkZWEyYzI2NjJjMDQ5ZWE4NmY5MCIsImlhdCI6MTY0Mjk1ODU2MCwiZXhwIjoxNjQ1NTUwNTYwfQ.zEO4m3l4vyqVoJBlnqcJh3TplHbNZrPZf-zAwuSkvzY",
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
        `http://13.229.197.2:1337/zones-or-buildings/${id}`,
        value,
        {
          headers: {
            Authorization:
              "Bearer " +
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxODRkZWEyYzI2NjJjMDQ5ZWE4NmY5MCIsImlhdCI6MTY0Mjk1ODU2MCwiZXhwIjoxNjQ1NTUwNTYwfQ.zEO4m3l4vyqVoJBlnqcJh3TplHbNZrPZf-zAwuSkvzY",
          },
        }
      );
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
};
