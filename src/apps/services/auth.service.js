/* eslint-disable import/no-anonymous-default-export */
import axios from "axios";
import { encryptStorage } from "../../utils/encryptStorage";
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
			return await axios.get(`${process.env.REACT_APP_API_URL}/users?_where[role]=4`, {
				headers: { Authorization: "Bearer " + session.jwt }
			});
		} catch (error) {
			console.error(error);
			throw error;
		}
	}
};
