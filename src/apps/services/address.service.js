/* eslint-disable import/no-anonymous-default-export */
import axios from "axios";
import { encryptStorage } from "../../utils/encryptStorage";
const session = encryptStorage.getItem("user_session");

export default {
	getAllAddresses: async function () {
		try {
			return await axios.get(`${process.env.REACT_APP_API_URL}/addresses`, {
				headers: { Authorization: "Bearer " + session.jwt }
			});
		} catch (error) {
			console.error(error);
			throw error;
		}
	}
};
