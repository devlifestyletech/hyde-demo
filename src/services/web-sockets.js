import io from "socket.io-client";
let STRAPI_ENDPOINT;

if (process.env.NODE_ENV !== "production") {
  // STRAPI_ENDPOINT = "http://localhost:1337";
  STRAPI_ENDPOINT = "https://hyde-dev.ap.ngrok.io";
} else {
  STRAPI_ENDPOINT = process.env.REACT_APP_API_URL;
}

export const socket = io(STRAPI_ENDPOINT);
