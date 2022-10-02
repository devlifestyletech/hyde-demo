import Axios from "axios";
import moment from "moment";
import { encryptStorage } from "../../../../utils/encryptStorage";
require("dotenv").config();
const URLGetPayments = `${process.env.REACT_APP_API_URL}/payments`;
const URLCreateBillingPayment = `${process.env.REACT_APP_API_URL}/payments/createBillingPayment`;
const URLUpdatePayment = `${process.env.REACT_APP_API_URL}/payments/updatePayment`;
const URLRejectReceipt = `${process.env.REACT_APP_API_URL}/payments/rejectReceipt`;
const URLPaymentDashboard = `${process.env.REACT_APP_API_URL}/payment-data`;
const URLPaymentCountBills = `${process.env.REACT_APP_API_URL}/payments/reportBillingPayment`;
const URLPaymentCountBillsOfMonth = `${process.env.REACT_APP_API_URL}/payments/getTotalYear`;
const URLAddress = `${process.env.REACT_APP_API_URL}/addresses`;
const GetBillsList = async (params) => {
const session = encryptStorage.getItem("user_session");
const auth = session !== undefined ? session.jwt : null;
const options = {
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${auth}`,
  },
};
  let resultData;
  console.log(`${URLGetPayments}?${params}`)
  resultData = await Axios.get(`${URLGetPayments}?${params}`, options)
    .then(async (result) => {
      if (result.status === 200) {
        result.data.map(async (e) => {
          const resutlDate = await moment(e.createdAt).format(
            "DD/MM/YYYY HH:mm"
          );
          e.Total_BillsPayment = parseFloat(e.Total_BillsPayment)
            .toFixed(2)
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          e.createdAt = resutlDate;
          if (e.BillsPayment_Status==="Pending review") {
            e.readStatus=await CheckNotification(e.BillsPayment_Invoice)
          }
        });
        return result.data;
      } else {
      }
    })
    .catch((err) => {
      console.log("error:", err);
    });
  // console.log(`${URLGetPayments}?${params}`);
  return resultData;
};

const CheckNotification = async (id) => {
  const session = encryptStorage.getItem("user_session");
const auth = session !== undefined ? session.jwt : null;
const options = {
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${auth}`,
  },
};
  const FCMtoken = await encryptStorage.getItem('fcm_token_data');
  let status = false
  if (FCMtoken !== null && FCMtoken !== undefined) {
    await FCMtoken.find((e) => {
      if(e.title === 'Payments'){
        if (
          e.billPaymentRef1 === id &&
          e.readStatus === false
        ) {
       status=true
         
        }
      }
    });
  }
  return status
}
// get out date
const GetOutDate = async (param) => {
  const session = encryptStorage.getItem("user_session");
const auth = session !== undefined ? session.jwt : null;
const options = {
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${auth}`,
  },
};
  let resultData;

  resultData = await Axios.get(
    `${URLGetPayments}?&BillsPayment_Status=Out Date&Address_Customer_contains=${param}`,
    options
  )
    .then((result) => {
      if (result.status === 200) {
        result.data.map(async (e) => {
          const resutlDate = await moment(e.createdAt).format(
            "DD/MM/YYYY HH:mm"
          );
          e.Total_BillsPayment = parseFloat(e.Total_BillsPayment)
            .toFixed(2)
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          e.createdAt = resutlDate;
        });
        return result.data;
      }
    })
    .catch((err) => {
      console.log("error:", err);
    });
  return resultData;
};
// get out date
const GetCountBillsList = async (params) => {
  const session = encryptStorage.getItem("user_session");
const auth = session !== undefined ? session.jwt : null;
const options = {
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${auth}`,
  },
};
  let resultData;
  resultData = await Axios.get(`${URLGetPayments}/count?${params}`, options)
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

const GetDataSCB = async (billingId) => {
  const session = encryptStorage.getItem("user_session");
const auth = session !== undefined ? session.jwt : null;
const options = {
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${auth}`,
  },
};
  let resultDataSCB;
  if (billingId !== null) {
    await Axios.get(`${process.env.REACT_APP_API_URL}/sc-bsilps`)
      .then((res) => {
        resultDataSCB = res.data;
      })
      .catch((err) => {
        console.log(err);
      });

    const resultData = resultDataSCB.filter((e) => {
      return e.billPaymentRef1 === billingId;
    });

    return resultData[0];
  }
};

//update status rescript
const UpdateReceipt = async (data) => {
  const session = encryptStorage.getItem("user_session");
const auth = session !== undefined ? session.jwt : null;
const options = {
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${auth}`,
  },
};
  let result = null;
  result = await Axios.put(
    `${URLUpdatePayment}/${data.idBilling}`,
    { BillsPayment_Status: "Payment successful" },
    options
  )
    .then((res) => {
      return res.status === 200 ? true : false;
    })
    .catch((err) => {
      console.error(err);
      return false;
    });
  const resultOutdate = await GetOutDate(data.Address_Customer);
  if (resultOutdate !== undefined && resultOutdate.length > 0) {
    resultOutdate.map(async (e) => {
      result = await Axios.delete(`${URLGetPayments}/${e.id}`, options)
        .then((resultData) => {
          return resultData.status === 200 ? true : false;
        })
        .catch((err) => {
          return false;
        });
    });
  }
  return result;
};

//update status rescript
const RejectReceipt = async (data, annotaion) => {
  const session = encryptStorage.getItem("user_session");
const auth = session !== undefined ? session.jwt : null;
const options = {
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${auth}`,
  },
};
  console.log("update:", annotaion,data.idBilling);
  const result = await Axios.put(
    `${URLRejectReceipt}/${data.idBilling}`,
    { BillsPayment_Status: "Payment annotation", annotation_payment: annotaion },
    options
  )
    .then((res) => {
      return res.status === 200 ? true : false;
    })
    .catch((err) => {
      console.error(err);
      return false;
    });
  return result;
};

//update status rescript
const EditAddress = async (address_id, value) => {
  const session = encryptStorage.getItem("user_session");
const auth = session !== undefined ? session.jwt : null;
const options = {
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${auth}`,
  },
};
  const statusResult = await Axios.put(
    `${URLAddress}/${address_id}`,
    { Status_billpayment: value === undefined ? true : false },
    options
  )
    .then((result) => {
      return result.status === 200 ? true : false;
    })
    .catch((err) => {
      return false;
    });
  console.log("EditAddress:", statusResult);
  return statusResult;
};

const PostDataReceipt = async (data) => {
  const session = encryptStorage.getItem("user_session");
const auth = session !== undefined ? session.jwt : null;
const options = {
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${auth}`,
  },
};
  const postData = {
    BillsPayment_Invoice: data.invoice_id,
    BillsPayment_Status: "Wait for payment",
    BillsPayment_Date_Start: data.DueDateStart,
    BillsPayment_Date_End: data.DueDateEnd,
    BillsPayment_AllType: data.subBilling,
    Name_Customer: data.name,
    Address_Customer: data.Address_Customer,
    address_id: data.address_id,
    Total_BillsPayment: data.totalAmount,
    Receipt_Status: false,
    annotation_payment: "",
    Receipt_Status_Export: false,
  };
  const result = await Axios.post(`${URLCreateBillingPayment}`, postData, options)
    .then(async (res) => {
      console.log("payment", res);
      return res.status === 200
        ? await EditAddress(data.address_id, false)
        : false;
    })
    .catch((err) => {
      return false;
    });
  return result;
};

// get count not billing gen
const GetCountGetAddressCustomer = async (params) => {
  const session = encryptStorage.getItem("user_session");
const auth = session !== undefined ? session.jwt : null;
const options = {
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${auth}`,
  },
};
  let resultData;
  // resultData = await Axios.get(`${URLAddress}/count?Status_billpayment=true`, options)
  console.log(`${URLAddress}/count?${params}`);
   resultData = await Axios.get(`${URLAddress}/count?Status_billpayment=true`, options)
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
//get count not billing gen

const GetAddressCustomer = async (params) => {
  const session = encryptStorage.getItem("user_session");
const auth = session !== undefined ? session.jwt : null;
const options = {
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${auth}`,
  },
};
  console.log(`${URLAddress}?${params}`, options);
  let resultData = [];
  await Axios.get(`${URLAddress}?${params}`, options)
    .then((result) => {
      result.data.map((e) => {
        let resultAddress = {};
        if (e.owner != undefined) {
          resultAddress.address = e.address_number;
          // resultAddress.first_Name = e.owner.first_name_en;
          // resultAddress.last_Name = e.owner.last_name_en;
          resultAddress.user_id = e.owner.id;
          resultAddress.address_id = e.id;
          resultAddress.fullname = e.owner.fullname;
          resultAddress.status_billing = e.Status_billpayment;
        }
        if (e.Status_billpayment && e.owner != undefined) {
          resultData.push(resultAddress);
        }
        // resultData.push(resultAddress);
      });
    })
    .catch((err) => {
      console.error(err);
    });
  console.log(`${URLAddress}?${params}`);
  return resultData;
};

// delete billingPayment by id
const DeleteBillsPayment = async (paymentID) => {
  const session = encryptStorage.getItem("user_session");
const auth = session !== undefined ? session.jwt : null;
const options = {
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${auth}`,
  },
};
  let resultDataByID = null;
  let resultDataAddressId = null;
  await Axios.get(`${URLGetPayments}/${paymentID}`, options)
    .then((result) => {
      resultDataByID =
        result.data.BillsPayment_Status === "Wait for payment"
          ? paymentID
          : null;
      resultDataAddressId =
        result.data.BillsPayment_Status === "Wait for payment"
          ? result.data.address_id
          : null;
    })
    .catch((err) => {
      console.error(err);
    });
  if (resultDataByID !== null && resultDataAddressId !== null) {
    const result = await Axios.delete(`${URLGetPayments}/${paymentID}`, options)
      .then(async (result) => {
        // console.log("delete:", result);
        if (result.status === 200) {
          const resultAdress = await EditAddress(resultDataAddressId);
          if (resultAdress) {
            return true;
          } else {
            return false;
          }
        }
        // return   result.status === 200 ? true:false
      })
      .catch((err) => {
        return false;
      });
    return result;
  }
};
// delete billingPayment by id
const GetDataPaymentDashboard = async (params) => {
  const session = encryptStorage.getItem("user_session");
const auth = session !== undefined ? session.jwt : null;
const options = {
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${auth}`,
  },
};
  console.log('params',params)
  let url=URLPaymentDashboard
  if(params!== undefined && params !== null){
    url = `${URLPaymentDashboard}?${params}&_sort=Date_table:desc`
  }else{
    url=url+'?_sort=Date_table:desc'
  }
 const dataDashBorad= await Axios.get(url, options)
    .then((result) => {
        if (result.status === 200) 
        {
           console.log('paymentdasdboard',result.data)
         return result.data
        }
      })
    .catch();
    return dataDashBorad
};

const GetCountBills = async () => {
  const session = encryptStorage.getItem("user_session");
const auth = session !== undefined ? session.jwt : null;
const options = {
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${auth}`,
  },
};
  const dataDashBorad= await Axios.get(URLPaymentCountBills, options)
     .then((result) => {
       if (result.status === 200) 
       {
           console.log('billiing:',result.data.data[0].totalStatus)
          return result.data.data[0].totalStatus
         }
       })
     .catch(
       (err)=>{
         console.error(err);
       }
     );
     return dataDashBorad
 };
 const GetCountBillsOfMonth = async () => {
  const session = encryptStorage.getItem("user_session");
const auth = session !== undefined ? session.jwt : null;
const options = {
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${auth}`,
  },
};
  const dataBillsOfMonth= await Axios.get(URLPaymentCountBillsOfMonth, options)
     .then((result) => {
       if (result.status === 200) 
       {
           console.log('billiing:',result.data.data[0].totalStatus)
          return result.data.data[0].totalStatus
         }
       })
     .catch(
       (err)=>{
         console.error(err);
       }
     );
     return dataBillsOfMonth
 };

export {
  GetBillsList,
  GetCountBillsList,
  GetDataSCB,
  UpdateReceipt,
  RejectReceipt,
  PostDataReceipt,
  GetAddressCustomer,
  DeleteBillsPayment,
  GetOutDate,
  GetCountGetAddressCustomer,
  GetDataPaymentDashboard,
  GetCountBills,
  GetCountBillsOfMonth
};
