import axios from "axios";
import { encryptStorage } from "../../../utils/encryptStorage";
require('dotenv').config()
const URLWarranty = `${process.env.REACT_APP_API_ONEAPP}warranty-projects`;
const URLWarrantyAddress = `${process.env.REACT_APP_API_ONEAPP}addresses`;
const imageURL=`${process.env.REACT_APP_API_ONEAPP}upload`

const session = encryptStorage.getItem("user_session");
const auth = session !== undefined?session.jwt:null;
const options = {
    headers: {
        "Content-Type": "application/json",
        Authorization:`Bearer ${auth}`
    }
}
const optionsImage = {
    headers: {
        'Content-Type': 'multipart/form-data',
        Authorization:`Bearer ${auth}`
    }
}
const getWarranty = async (params) => {
    let resultData;
    let progressBuilding = [];
    let dataSubBuilding;
    resultData = await axios
        .get(`${URLWarrantyAddress}?${params}`,options)
        .then((result) => {
            if (result.status === 200) {
                result.data.map(async (e, i) => {
                    
                    if(e.owner !== undefined&&e.owner !==null){

                        e.ownerName =e.owner.firstname+'\n'+e.owner.lastname
                            e.Nationality=e.owner.nationality
                            e.Tel =e.owner.tel
                            e.email=e.owner.email
                    }
                    e.No = i + 1;
                    e.key = i;
                  
                   if( e.warranty_projects.length >0){
                    e.warranty_projects.map((f, j) => {
                        if (f.device_image.length>0) {
                            
                            f.device_image[0].url=process.env.REACT_APP_API_URL+ f.device_image[0].url
                            f.imageUrl= f.device_image[0].url
                        }
                    });
                   }
                    e.totalProgress = (e.totalProgress / e.count).toFixed(0);
                    progressBuilding.push( e.warranty_projects);
                });
                return result.data;
            }
          
        })
        .catch((err) => {
            console.error(err);
        });
    dataSubBuilding = {
        dataTop: resultData,
        dataChild: progressBuilding,
    };
//   console.log("warranty_api:",`${URLWarrantyAddress}?${params}`);
    return dataSubBuilding;
};

//get count warranty
const getCountWarrantyList = async (params) => {
    let resultData;
    resultData = await axios.get(`${URLWarrantyAddress}/count?${params}`,options)
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
//get count warranty

// delete deleteWarranty by id
const deleteWarranty = async (warrantyID) => {
    let resultDataByID = null;
    await axios
        .get(`${URLWarranty}/${warrantyID}`,options)
        .then((result) => {
            if (result.data!==null) {
                
                // console.log("resultDataByID:",result.data);
               resultDataByID = {
                    dataImage:result.data.device_image,
                    warrantyid:warrantyID
                }
            }else{
                resultDataByID = {
                    dataImage:[],
                    warrantyid:null
                }
            }
        })
        .catch((err) => {
            console.error(err);
        });
    if (resultDataByID !== null) {
        const result = await axios
            .delete(`${URLWarranty}/${resultDataByID.warrantyid}`,options)
            .then( async(result) => {
                if (resultDataByID.dataImage.length>0) {
                    
                    await removeImageWarranty(resultDataByID.dataImage[0].id)
                }
                return result.status === 200 ? true : false;
            })
            .catch((err) => {
                return false;
            });
        return result;
    }
};
//delete deleteWarranty by id

const addWarranty = async (data) => {
    const resultImage =await uploadImageWarranty(data.Device_image[0].originFileObj)
    if (resultImage.status===true) {
        const dataWarranty = {
            device_name:data.WarrantyName,
            serial_number:data.SerialNumber,
            purchase_date:data.PurchaseDate,
            expire_date:data.ExpireDate,
            device_image:resultImage.data !== undefined ?resultImage.data:[],
            "users_permissions_user":data.owner,
            "addresses":data.address
        };
       const result = await axios.post(`${URLWarranty}`, dataWarranty, options).then(async (res) => {
                return res.status === 200 ? true : false;
            })
            .catch((err) => {
                console.error(err.response.data);
                return false;
            });
        return result;
    }
  
};

//edit EMS
const editWarranty= async (warrantyID,data) => {
    // console.log("editWarranty:",data.old_image[0]);
    let resultImage=null
    if (data.Device_image[0]?.originFileObj !== undefined) {
    resultImage =await uploadImageWarranty(data.Device_image[0].originFileObj)
 
 
    }else{
        resultImage={data:data.Device_image}
    }
    const dataWarranty = {
        device_name:data.WarrantyName,
        serial_number:data.SerialNumber,
        purchase_date:data.PurchaseDate,
        expire_date:data.ExpireDate,
         device_image:resultImage.data !== undefined ?resultImage.data:[],
        "users_permissions_user":data.owner,
        "addresses":data.address
    };
    if (data.status_Image===true ) {
     
        await removeImageWarranty(data.old_image[0].id)
    }
    const result = await axios
        .put(`${URLWarranty}/${warrantyID}`, dataWarranty, options)
        .then(async (res) => {
            return res.status === 200 ? true : false;
        })
        .catch((err) => {
            console.error(err.response.data);
            return false;
        });
    return result;
  }
//edit EMS

const uploadImageWarranty = async (image) => {
    // console.log("image:",image);
    if (image !== undefined && image !== null) {
        const image_building = new FormData();
        image_building.append('files', image)

        const resultImage= await axios
            .post(
                imageURL,
                image_building,
                optionsImage
            )
            .then((result) => {
                // console.log("resultFormImage:",result.data);
                return{
                    status:true,
                    data:result.data,
                    massage:"upload images successfully"
                }
            })
            .catch((err) => {
                console.error(err.response.data);
                return{
                    status:false,
                    massage:"error upload image"
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
const removeImageWarranty = async (imageID) => {
    const resultRemoveImage=await axios.delete(`${imageURL}/files/${imageID}`,options).then((result) => {
        //  console.log("removeImage:",result);
        return result.status === 200 ? {status:true,message:"remove successfully"} :{status:false,message:"remove failed"}
    }).catch((err) => {
        console.log(err.response.data);
        return {status:false,message:"remove failed"}
    });
    return resultRemoveImage
}

export { getWarranty, deleteWarranty,addWarranty,editWarranty,
    getCountWarrantyList,
    removeImageWarranty};
