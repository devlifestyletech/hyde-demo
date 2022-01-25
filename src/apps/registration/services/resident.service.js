/* eslint-disable import/no-anonymous-default-export */
import axios from "axios";
import { encryptStorage } from "../../../utils/encryptStorage";
const session = encryptStorage.getItem("user_session");

export default {
  getAllUsers: async function () {
    let data = [];
    try {
      await axios
        .get(`http://13.229.197.2:1337/users`, {
          headers: {
            Authorization:
              "Bearer " +
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxODRkZWEyYzI2NjJjMDQ5ZWE4NmY5MCIsImlhdCI6MTY0Mjk1ODU2MCwiZXhwIjoxNjQ1NTUwNTYwfQ.zEO4m3l4vyqVoJBlnqcJh3TplHbNZrPZf-zAwuSkvzY",
          },
        })
        .then((response) => {
          response.data
            .filter((user) => user.role.type === "resident")
            .forEach((user, index) => {
              let newData = {
                key: index,
                number: index + 1,
                ...user,
              };
              data.push(newData);
            });
        });
      return data;
    } catch (e) {
      console.error(e);
      throw e;
    }
  },

  deleteUser: async function (id) {
    try {
      await axios
        .delete(`http://13.229.197.2:1337/users/${id}`, {
          headers: {
            Authorization:
              "Bearer " +
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxODRkZWEyYzI2NjJjMDQ5ZWE4NmY5MCIsImlhdCI6MTY0Mjk1ODU2MCwiZXhwIjoxNjQ1NTUwNTYwfQ.zEO4m3l4vyqVoJBlnqcJh3TplHbNZrPZf-zAwuSkvzY",
          },
        })
        .then((res) => res.data);
    } catch (e) {
      console.error(e);
      throw e;
    }
  },

  getAddress: async function () {
    try {
      const data = await axios.get(`http://13.229.197.2:1337/projects`, {
        headers: {
          Authorization:
            "Bearer " +
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxODRkZWEyYzI2NjJjMDQ5ZWE4NmY5MCIsImlhdCI6MTY0Mjk1ODU2MCwiZXhwIjoxNjQ1NTUwNTYwfQ.zEO4m3l4vyqVoJBlnqcJh3TplHbNZrPZf-zAwuSkvzY",
        },
      });
      return data;
    } catch (e) {
      console.error(e);
      throw e;
    }
  },

  updateResidentData: async function (data, id) {
    try {
    } catch (error) {}
  },

  getUserData: async function (id) {
    try {
      const data = await axios.get(`http://13.229.197.2:1337/users/${id}`, {
        headers: {
          Authorization:
            "Bearer " +
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxODRkZWEyYzI2NjJjMDQ5ZWE4NmY5MCIsImlhdCI6MTY0Mjk1ODU2MCwiZXhwIjoxNjQ1NTUwNTYwfQ.zEO4m3l4vyqVoJBlnqcJh3TplHbNZrPZf-zAwuSkvzY",
        },
      });
      return data;
    } catch (error) {
      console.error(error);
    }
  },
  addUserToAddress: async function (value) {
    try {
      return await axios.post(
        `http://13.229.197.2:1337/resident-lists`,
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
  removeUserFromAddress: async function (id) {
    try {
      return await axios.delete(
        `http://13.229.197.2:1337/resident-lists/${id}`,
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
  changeRoleUser: async function (value, id) {
    try {
      return await axios.put(
        `http://13.229.197.2:1337/resident-lists/${id}`,
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
