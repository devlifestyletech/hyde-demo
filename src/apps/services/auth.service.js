/* eslint-disable import/no-anonymous-default-export */
import axios from "axios";
import { encryptStorage } from "../../utils/encryptStorage";

export default {
	signIn: async function (value) {
		try {
			return await axios.post(`${process.env.REACT_APP_API_URL}auth/local`, value);
		} catch (error) {
			console.error(error);
			throw error;
		}
	}
};
