/* eslint-disable import/no-anonymous-default-export */
import axios from "axios";
import { encryptStorage } from "../../../utils/encryptStorage";
const session = encryptStorage.getItem("user_session");

export default {
  getAllUsers: async function () {
    let data = [];
    try {
      await axios
        .get(`${process.env.REACT_APP_API_URL}/users`, {
          headers: {
            Authorization: "Bearer " + session.jwt,
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
        .delete(`${process.env.REACT_APP_API_URL}/users/${id}`, {
          headers: {
            Authorization: "Bearer " + session.jwt,
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
      const data = await axios.get(
        `${process.env.REACT_APP_API_URL}/projects`,
        {
          headers: {
            Authorization: "Bearer " + session.jwt,
          },
        }
      );
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
      const data = await axios.get(
        `${process.env.REACT_APP_API_URL}/users/${id}`,
        {
          headers: {
            Authorization: "Bearer " + session.jwt,
          },
        }
      );
      return data;
    } catch (error) {
      console.error(error);
    }
  },

  addUserToAddress: async function (value) {
    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/users/${value.users_permissions_user}`,
        {
          address: value.address,
        },
        {
          headers: {
            Authorization: "Bearer " + session.jwt,
          },
        }
      );
      await axios.post(
        `${process.env.REACT_APP_API_URL}/resident-lists`,
        value,
        {
          headers: {
            Authorization: "Bearer " + session.jwt,
          },
        }
      );
      if (value.resident_role === "Owner") {
        await axios.put(
          `${process.env.REACT_APP_API_URL}/addresses/${value.address}`,
          {
            owner: value.users_permissions_user,
          },
          {
            headers: {
              Authorization: "Bearer " + session.jwt,
            },
          }
        );
      }
      return true;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  removeUserFromAddress: async function (residentListId, userId) {
    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/users/${userId}`,
        {
          address: null,
        },
        {
          headers: {
            Authorization: "Bearer " + session.jwt,
          },
        }
      );
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/resident-lists/${residentListId}`,
        {
          headers: {
            Authorization: "Bearer " + session.jwt,
          },
        }
      );
      return true;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  changeRoleUser: async function (value, id) {
    try {
      return await axios.put(
        `${process.env.REACT_APP_API_URL}/resident-lists/${id}`,
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
