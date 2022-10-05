import axios from 'axios';
import { encryptStorage } from '../../../utils/encryptStorage';
require('dotenv').config();
const notification_url = `https://noti-dev.ap.ngrok.io/api/message/send`;
const session = encryptStorage.getItem('user_session');
const auth = session !== undefined ? session.jwt : null;
const options = {
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${auth}`,
  },
};
const SendNotificationFixChat = async (residentID,data) => {
  try {
   const dataSendNotification = {
      userId: `${residentID}`,
      message: {
        notification: {
          title: 'ServiceCenter',
          body: `${data.user} : ${data.messages}`,
        },
        data: {
          title: 'ServiceCenter',
          body: `${data.user} : ${data.messages}`,
        },
      },
    };
   await axios.post(notification_url, dataSendNotification,options);
  } catch (error) {
console.error("error notichat:",error);
  }
};
export{SendNotificationFixChat}