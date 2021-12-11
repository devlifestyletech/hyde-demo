/* eslint-disable import/no-anonymous-default-export */
import axios from "axios";
import { encryptStorage } from "../utils/encryptStorage";
const session = encryptStorage.getItem("user_session");

export default {
	uploadImage: async function (imageData) {
		try {
			return await axios.post(`${process.env.REACT_APP_API_URL}/upload`, imageData, {
				headers: { Authorization: "Bearer " + session.jwt }
			});
		} catch (error) {}
	}
};
