import axios from "axios";
import Axios from "axios";
import { encryptStorage } from "../../../../utils/encryptStorage";
require('dotenv').config()
const session = encryptStorage.getItem("user_session");
const auth = session !== undefined?session.jwt:null;
const options = {
    headers: {
        "Content-Type": "application/json",
        Authorization:`Bearer ${auth}`
    }
}
const EMSurl =`${process.env.REACT_APP_API_ONEAPP}emergency-contact-lists`
const getDataEMS = async (params) => {

  const resultData = await Axios.get(`${EMSurl}?${params}`,options)
    .then((result) => {
      if (result.status === 200) {
        result.data.map(async (e, i) => {
          e.No = i + 1;
          e.key = i;
        });
        return result.data;
      }
      // console.log(result.data)
    })
    .catch((err) => {
      console.error(err);
    });
 
  return resultData;
};


const getCountDataEMS = async (params) => {
  let resultData;
  resultData = await Axios.get(`${EMSurl}/count?${params}`,options)
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

// add EMS
const addEMS = async (data) => {
  
  const EMSdata = {
    Name: data.Name,
    Tel: data.Tel,
    Type: data.type,
    Latitude: data.latitude.toString(),
    Longitude:data.longitude.toString(),
    location:data.location,
  };
  const result = await axios
    .post(EMSurl, EMSdata, options)
    .then(async (res) => {
      return res.status === 200 ? true : false;
    })
    .catch((err) => {
      return false;
    });
  return result;
};
// add EMS

// delete billingPayment by id
const deleteEMS = async (EMSD) => {
    let resultDataByID = null;
    await axios
        .get(`${EMSurl}/${EMSD}`,options)
        .then((result) => {
            resultDataByID = result.data ? EMSD : null;
        })
        .catch((err) => {
            console.error(err);
        });
    if (resultDataByID !== null) {
        const result = await axios
            .delete(`${EMSurl}/${EMSD}`,options)
            .then((result) => {
                // console.log("delete:", result);
                return result.status === 200 ? true : false;
            })
            .catch((err) => {
                return false;
            });
        return result;
    }
};
//delete billingPayment by id

//edit EMS
const editEMS= async (EMSID,data) => {

    const EMSdata = {
        Name: data.Name,
        Tel: data.Tel,
        Type: data.type,
        Latitude: data.latitude.toString(),
    Longitude:data.longitude.toString(),
        location:data.location,
      };
    //  console.log("postDataEdit:",EMSdata);
     const result = await axios
       .put((`${EMSurl}/${EMSID}`), EMSdata,options)
       .then(async (res) => {
         return res.status === 200 ? true : false;
       })
       .catch((err) => {
         return false;
       });
     return result;
  }
//edit EMS
export { getDataEMS,getCountDataEMS,addEMS,deleteEMS,editEMS };
