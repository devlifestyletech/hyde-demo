/* eslint-disable import/no-anonymous-default-export */
import axios from "axios";
import { encryptStorage } from "../utils/encryptStorage";
const session = encryptStorage.getItem("user_session");

export default {
	signIn: async function (value) {
		try {
			return await axios.post(`${process.env.REACT_APP_API_URL}/auth/local`, value);
		} catch (error) {
			console.error(error);
			throw error;
		}
	},
	registration: async function (value) {
		try {
			return await axios.post(`${process.env.REACT_APP_API_URL}/auth/local/register`, value, {
				headers: { Authorization: "Bearer " + session.jwt }
			});
		} catch (error) {
			console.error(error);
			throw error;
		}
	},
	getAllResident: async function () {
		try {
			return await axios.get(`${process.env.REACT_APP_API_URL}/users?_where[role]=61b40d9a268f0d019c9c0e7e`, {
				headers: { Authorization: "Bearer " + session.jwt }
			});
		} catch (error) {
			console.error(error);
			throw error;
		}
	},
	logout: async function () {
		try {
			encryptStorage.removeItem("user_session");
			console.log("remove");
			window.location.href = "/";
		} catch (error) {
			console.error(error);
			throw error;
		}
	},
	deleteUser: async function (id) {
		try {
			return await axios.delete(`${process.env.REACT_APP_API_URL}/users/${id}`, {
				headers: { Authorization: "Bearer " + session.jwt }
			});
		} catch (error) {
			console.error(error);
			throw error;
		}
	},
	getUserData: async function (id) {
		try {
			return await axios.get(`${process.env.REACT_APP_API_URL}/users/${id}`, {
				headers: { Authorization: "Bearer " + session.jwt }
			});
		} catch (error) {
			console.error(error);
			throw error;
		}
	},
	editUserData: async function (id, value) {
		try {
			return await axios.put(`${process.env.REACT_APP_API_URL}/users/${id}`, value, {
				headers: { Authorization: "Bearer " + session.jwt }
			});
		} catch (error) {
			console.error(error);
			throw error;
		}
	}
};
