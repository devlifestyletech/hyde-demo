import Axios from "axios";
import moment from "moment";
import { encryptStorage } from "../../../../utils/encryptStorage";
require('dotenv').config()
const URLreScrpit = `${process.env.REACT_APP_API_URL}/payments`;
const URLAddress = `${process.env.REACT_APP_API_URL}/addresses`;
const URLUser = `${process.env.REACT_APP_API_URL}/users`;
const session = encryptStorage.getItem("user_session");
const auth = session !== undefined ? session.jwt : null;
const options = {
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${auth}`
  }
}
const GetBillinglist = async (params) => {
  let resultData;
  resultData = await Axios.get(`${URLreScrpit}?${params}`, options)
    .then((result) => {
      if (result.status === 200) {
        result.data.map(async (e) => {
          const resutlDate = await moment(e.createdAt).format("DD/MM/YYYY HH:mm");
          e.Total_BillsPayment = parseFloat(e.Total_BillsPayment).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
          e.createdAt = resutlDate;
        });
        return result.data;

      } else {

      }
    })
    .catch((err) => {
      console.log("error:", err);
    });
  // console.log(`${URLreScrpit}?${params}`);
  return resultData;
};

// get out date
const getOutDate = async (param) => {
  let resultData;
  resultData = await Axios.get(`${URLreScrpit}?&BillsPayment_Status=Out Date&Address_Customer_contains=${param}`, options)
    .then((result) => {
      if (result.status === 200) {

        result.data.map(async (e) => {
          const resutlDate = await moment(e.createdAt).format("DD/MM/YYYY HH:mm");
          e.Total_BillsPayment = parseFloat(e.Total_BillsPayment).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
          e.createdAt = resutlDate;
        });
        return result.data;

      }
    })
    .catch((err) => {
      console.log("error:", err);
    });
  // console.log(`${URLreScrpit}?&BillsPayment_Status=Out Date&Address_Customer_contains=${param}`)
  return resultData;
};
// get out date
const GetCountBillinglist = async (params) => {
  let resultData;
  resultData = await Axios.get(`${URLreScrpit}/count?${params}`, options)
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

const getDataSCB = async (billingId) => {
  let resultDataSCB;
  if (billingId !== null) {
    await Axios.get(
      `${process.env.REACT_APP_API_URL}/sc-bsilps`
    )
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
const updateRescrpt = async (data) => {
  let result = null
  result = await Axios
    .put(`${URLreScrpit}/${data.idBilling}`, { "BillsPayment_Status": "Payment successfull" }, options)
    .then((res) => {
      return res.status === 200 ? true : false;
    })
    .catch((err) => {
      console.error(err);
      return false
    });
  const resultOutdate = await getOutDate(data.Address_Customer)
  if (resultOutdate !== undefined && resultOutdate.length > 0) {
    resultOutdate.map(async (e) => {
      result = await Axios.delete(`${URLreScrpit}/${e.id}`,options).then((resultData) => {
        return resultData.status === 200 ? true : false;
      }).catch((err) => {
        return false;
      });
    })
  }
  return result;
};

//update status rescript
const rejectRescrpt = async (data,annotaion) => {
  console.log("update:", annotaion)
  const result = await Axios
    .put(`${URLreScrpit}/${data.idBilling}`, { "BillsPayment_Status": "Wait for payment","annotation_payment":annotaion }, options)
    .then((res) => {
      return res.status === 200 ? true : false;
    })
    .catch((err) => {
      console.error(err);
      return false
    });
  return result;
};

//update status rescript
const editAddress = async (address_id, value) => {
  const statusResult = await Axios.put(`${URLAddress}/${address_id}`, { "Status_billpayment": value === undefined ? true : false }, options).then((result) => {
    return result.status === 200 ? true : false
  }).catch((err) => {
    return false
  });
  console.log("editAddress:", statusResult);
  return statusResult
}

const postdataRescrpt = async (data) => {

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
    annotation_payment:"",
    Receipt_Status_Export: false,
  };
  const result = await Axios
    .post(`${URLreScrpit}`, postData, options)
    .then(async (res) => {

      return res.status === 200 ? await editAddress(data.address_id, false) : false;
    })
    .catch((err) => {
      return false;

    });
  return result;
};

// get count not billing gen
const getCountaddressCustomer = async (params) => {
  let resultData;
  resultData = await Axios.get(`${URLAddress}/count?${params}`, options)
    .then((result) => {
      if (result.status === 200) {
        return result.data;
      }
    })
    .catch((err) => {
      console.log(err);
    });
  console.log(`${URLAddress}/count?${params}`, options);
  return resultData;

};
//get count not billing gen

const addressCustomer = async (params) => {
  let resultData = [];
  await Axios.get(`${URLAddress}?${params}`, options)
    .then((result) => {
      result.data.map((e) => {
        let resultAddress = {};
        resultAddress.address = e.address_number;
        resultAddress.first_Name = e.owner.firstname;
        resultAddress.last_Name = e.owner.lastname;
        // resultAddress.user_id = e.owner.id;
        resultAddress.address_id = e.id;
        resultAddress.fullname = e.owner.fullname;
        resultAddress.status_billing = e.Status_billpayment;
        if (e.Status_billpayment) {

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
const deleteBillingPayment = async (paymentID) => {
  let resultDataByID = null;
  let resultDataAddressId = null;
  await Axios
    .get(`${URLreScrpit}/${paymentID}`, options)
    .then((result) => {
      resultDataByID = result.data.BillsPayment_Status === "Wait for payment"
        ? paymentID
        : null;
      resultDataAddressId = result.data.BillsPayment_Status === "Wait for payment"
        ? result.data.address_id
        : null;
    })
    .catch((err) => {
      console.error(err);
    });
  if (resultDataByID !== null && resultDataAddressId !== null) {
    const result = await Axios
      .delete(`${URLreScrpit}/${paymentID}`, options)
      .then(async (result) => {

        // console.log("delete:", result);
        if (result.status === 200) {
          const resultAdress = await editAddress(resultDataAddressId)
          if (resultAdress) {
            return true
          } else {
            return false
          }
        }
        // return   result.status === 200 ? true:false
      })
      .catch((err) => {
        return false
      });
    return result;
  }
};
// delete billingPayment by id

export {
  GetBillinglist,
  GetCountBillinglist,
  getDataSCB,
  updateRescrpt,
  rejectRescrpt,
  postdataRescrpt,
  addressCustomer,
  deleteBillingPayment,
  getOutDate,
  getCountaddressCustomer
};
