import Axios from "axios";
import moment from "moment";
import { encryptStorage } from "../../../utils/encryptStorage";
require("dotenv").config();
const fix_report_url = `${process.env.REACT_APP_API_URL}/fixing-reports`;

const session = encryptStorage.getItem("user_session");
const auth = session !== undefined ? session.jwt : null;
const options = {
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${auth}`,
  },
};
// count
const getCountFixReport = async (params) => {
  let resultData;
  resultData = await Axios.get(`${fix_report_url}/count?${params}`, options)
    .then((result) => {
      if (result.status === 200) {
        return result.data;
      }
    })
    .catch((err) => {
      console.log(err);
    });
  return resultData;
};
// data
const getFixReport = async (params) => { 
    let resultData=null
    await Axios.get(`${fix_report_url}?${params}`,options)
    .then((result) => {
        if (result.status===200 &&  result.data.length>0) {
           result.data.map((e,i)=>{
                e.number=i+1
                e.tel=e.informer?.tel
                e.owner=e.informer?.fullname
                e.address_number=e.address?.address_number
                e.submission_date=moment(e.submission_date).format("DD/MM/YYYY HH:mm")
            }) 
            resultData=result.data
        }
    }).catch((err) => {
        console.error(err)
    });
    return resultData
 }
 export {getFixReport,getCountFixReport}