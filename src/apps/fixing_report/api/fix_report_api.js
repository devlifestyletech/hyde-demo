import axios from "axios";
import moment from "moment";
import { encryptStorage } from "../../../utils/encryptStorage";
require("dotenv").config();
const fix_report_url = `${process.env.REACT_APP_API_URL}/fixing-reports`;
const imageURL = `${process.env.REACT_APP_API_URL}/upload`
const session = encryptStorage.getItem("user_session");
const auth = session !== undefined ? session.jwt : null;
const options = {
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${auth}`,
  },
};
const optionsImage = {
  headers: {
      'Content-Type': 'multipart/form-data',
      Authorization:`Bearer ${auth}`
  }
}
// count
const GetCountFixReport = async (params) => {
  let resultData;
  resultData = await axios.get(`${fix_report_url}/count?${params}`, options)
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
const GetFixReport = async (params) => { 
    let resultData=null
    await axios.get(`${fix_report_url}?${params}`,options)
    .then((result) => {
        if (result.status===200 &&  result.data.length>0) {
           result.data.map( async(e,i)=>{
                e.number=i+1
                e.tel=e.informer?.tel
                e.owner=e.informer?.fullname
                e.address_number=e.address?.address_number
                e.submission_date=moment(e.submission_date).format("DD/MM/YYYY HH:mm")
                if (e?.image_pending?.length>0) {
                  e?.image_pending?.map((i)=>{
                    i.url=process.env.REACT_APP_API_URL+i.url
                  })
                }
                e.readStatus=await CheckNotification(e.id)
              
                //image_repairing
                if (e?.image_repairing?.length>0) {
                  e?.image_repairing?.map((i)=>{
                    i.url=process.env.REACT_APP_API_URL+i.url
                  })
                }
                //image_success
                if (e?.image_success?.length>0) {
                  e?.image_success?.map((i)=>{
                    i.url=process.env.REACT_APP_API_URL+i.url
                  })
                }
            }) 
            resultData=result.data
        }
    }).catch((err) => {
        console.error(err)
    });
    return resultData
 }
 // data
 const GetFixReportByID = async (ID) => { 
  const session = encryptStorage.getItem("user_session");
const auth = session !== undefined ? session.jwt : null;
const options = {
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${auth}`,
  },
};

    let resultData=null
    await axios.get(`${fix_report_url}?id=${ID}`,options)
    .then((result) => {
        if (result.status===200 &&  result.data.length>0) {
           result.data.map( async(e,i)=>{
                e.number=i+1
                e.tel=e.informer?.tel
                e.owner=e.informer?.fullname
                e.address_number=e.address?.address_number
                e.submission_date=moment(e.submission_date).format("DD/MM/YYYY HH:mm")
                if (e?.image_pending?.length>0) {
                  e?.image_pending?.map((i)=>{
                    i.url=process.env.REACT_APP_API_URL+i.url
                  })
                }
                e.readStatus=await CheckNotification(e.id)
              
                //image_repairing
                if (e?.image_repairing?.length>0) {
                  e?.image_repairing?.map((i)=>{
                    i.url=process.env.REACT_APP_API_URL+i.url
                  })
                }
                //image_success
                if (e?.image_success?.length>0) {
                  e?.image_success?.map((i)=>{
                    i.url=process.env.REACT_APP_API_URL+i.url
                  })
                }
            }) 
            resultData=result.data
        }
    }).catch((err) => {
        console.error(err)
    });
    return resultData
 }

 const CheckNotification = async (id) => {
  const FCMtoken = await encryptStorage.getItem('fcm_token_data');
  let status = false
  if (FCMtoken !== null && FCMtoken !== undefined) {
    await FCMtoken.find((e) => {
      if(e.title === 'ServiceCenter'){
        if (
          e.userID === id &&
          e.readStatus === false
        ) {
       status=true
         
        }
      }
    });
  }
  return status
}
 const uploadImageFixReport = async (image) => {
  if (image !== undefined && image !== null) {
      const image_building = new FormData();
      image_building.append('files', image)
      const resultImage = await axios
          .post(
              imageURL,
              image_building,
              optionsImage
          )
          .then((result) => {
              return {
                  status: true,
                  data: result.data,
                  massage: "upload images successfully"
              }
          })
          .catch((err) => {
              console.error(err.response.data);
              return {
                  status: false,
                  massage: "error upload image"
              }
          });
      return resultImage
  } else {
      return {
          status: false,
          massage: "images empty",
      };
  }
  // eslint-disable-next-line no-undef

};
const removeImageFixReport = async (imageID) => {
  const resultRemoveImage = await axios.delete(`${imageURL}/files/${imageID}`,options).then((result) => {
      return result.status === 200 ? {status: true, message: "remove successfully"} : {
          status: false,
          message: "remove failed"
      }
  }).catch((err) => {
      console.log(err.response.data);
      return {status: false, message: "remove failed"}
  });
  return resultRemoveImage
}

const EditFixReport = async (userID, data) => {
  let statusRemove = 0, statusSuccess = 0
  let totalImage = [],image2=[]
  const resultImageUpload = await Promise.all( data.imageprogress.filter((e) => {
      if (e.originFileObj==undefined) {
          image2.push(e)
      }
      return e.originFileObj !== undefined
  }))

  if (data.oldImages !== null) {
   await Promise.all(data.oldImages.map(async (e) => {
          const result = await removeImageFixReport(e.id)
      }))
  }

  if (resultImageUpload.length > 0) {
      totalImage = await Promise.all(resultImageUpload.map(async (e) => {
          const resultUpload = await uploadImageFixReport(e.originFileObj)
          if (resultUpload.status === true) {

              image2.push(resultUpload.data[0])
              return resultUpload.data[0]

          } else {
              statusSuccess = 1
          }
      }))
  }
  
  if (statusRemove === 0 && statusSuccess === 0) {
      let allImage = null
      allImage=image2
      const postData = {
        pick_up_date:data.pick_up_date,
      opening_date:data.opening_date,
      closing_date:data.closing_date,
      status: data.status,
      cause:data.cause,
      solution:data.solution,
          };
          switch (data.oldStatus) {
            case "Pending":
              postData.image_pending= allImage.length === 0 ? null : allImage
             postData.image_repairing=data.image_repairing
             postData.image_success=data.image_success
              break;
            case "Repairing":
             postData.image_pending= data.image_pending
             postData.image_repairing= allImage.length === 0 ? null : allImage
             postData.image_success=data.image_success
              break;
            case "Success":
              postData.image_pending= data.image_pending
              postData.image_repairing=data.image_repairing
              postData.image_success= allImage.length === 0 ? null : allImage
              break;
          
            default:
              break;
          }
      const result = await axios
          .put(`${fix_report_url}/${userID}`,postData,options)
          .then(async (res) => {
            if(res.status === 200){
              let dataSendNotication={
                userId:data.owner,
                statusSerivceCenter:data.status
              }
              await SendNotification(dataSendNotication)
              return true
            }else{
              return false
            }
             
          })
          .catch((err) => {
              return false;
          });
      return result;
  }


}
const SendNotification= async (data) => { 
  try {
    await axios.post("https://noti-dev.ap.ngrok.io/api/message/send", {
      userId:`${data.userId}`,
      message: {
        notification: {
          title: "ServiceCenter",
          body: `Service Center ${data.statusSerivceCenter}`,
        },
        data: {
          title: "ServiceCenter",
          body: `Service Center ${data.statusSerivceCenter}`,
        },
      },
   })
  } catch (err) {
    console.error(err);
  }
  
 }
 export {GetFixReport,GetCountFixReport,EditFixReport,GetFixReportByID}