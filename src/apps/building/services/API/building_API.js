import axios from "axios";
import moment from "moment";
import { encryptStorage } from "../../../../utils/encryptStorage";
require('dotenv').config()
const URLBuilding = `${process.env.REACT_APP_API_ONEAPP}building-progresses`;
const imageURL = `${process.env.REACT_APP_API_ONEAPP}upload`
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
const getDataBuilding = async (params) => {
    let resultData;
    let progressBuilding = [];
    let dataSubBuilding;
    resultData = await axios
        .get(`${URLBuilding}?${params}`,options)
        .then((result) => {
            if (result.status === 200) {
                result.data.map(async (e, i) => {
                    e.creator = e.users_permissions_user.username;
                    const resutlDate = await moment(e.updatedAt).format(
                        "DD/MM/YYYY HH:mm"
                    );
                    e.updatedAt = resutlDate;
                    e.Location= e.project.province
                    e.No = i + 1;
                    e.key = i;
                    e.count = e.progress.length;
                    e.totalProgress = 0;
                    const subBuilding = {
                        startproject: e.start_date,
                        endproject: e.end_date,
                    };
                    e.progress.map((f, j) => {
                        subBuilding.name === undefined
                            ? (subBuilding.name = f.name + "\n")
                            : (subBuilding.name += f.name + "\n");
                        subBuilding.detail === undefined
                            ? (subBuilding.detail = f.detail + "\n")
                            : (subBuilding.detail += f.detail + "\n");
                        subBuilding.persentage === undefined
                            ? (subBuilding.persentage = f.persentage + "\n")
                            : (subBuilding.persentage += f.persentage + "\n");
                        subBuilding.key = j;
                        e.totalProgress = e.totalProgress + f.persentage;
                    });
                    if (e.imageprogress !== null&&e.imageprogress.length >0) {
                        e.imageprogress.map((m) => {
                            m.url = `${process.env.REACT_APP_API_URL}${m.url}`
                        })
                    }else{
                        e.imageprogress=null
                    }
                    e.totalProgress = (e.totalProgress / e.count).toFixed(0);
                    progressBuilding.push(subBuilding);
                });
                return result.data;
            }
            // console.log(result.data)
        })
        .catch((err) => {
            console.error(err);
        });
    dataSubBuilding = {
        dataTop: resultData,
        dataChild: progressBuilding,
    };
    //   console.log("subBuilding55:",`${URLBuilding}?${params}`)
    return dataSubBuilding;
};


//get count bulidProgress
const getCountBuildList = async (params) => {
    let resultData;
    resultData = await axios.get(`${URLBuilding}/count?${params}`,options)
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
//get count buildProgress
// delete billingPayment by id
const deleteBuilding = async (buildingID) => {
    let resultDataByID = null;
    await axios
        .get(`${URLBuilding}/${buildingID}`,options)
        .then((result) => {
            if (result.data!==null) {
                
                // console.log("resultDataByID:",result.data);
               resultDataByID = {
                    dataImage:result.data.imageprogress,
                    buildingId:buildingID
                }
            }else{
                resultDataByID = {
                    dataImage:[],
                    buildingId:null
                }
            }
        })
        .catch((err) => {
            console.error(err);
        });
    if (resultDataByID !== null) {
        const result = await axios
            .delete(`${URLBuilding}/${resultDataByID.buildingId}`,options)
            .then(async(result) => {
                if (resultDataByID.dataImage.length>0) {

                    await Promise.all(resultDataByID.dataImage.map(async (e) => {
                        // console.log("removeIamge:",e.id);
                        const result = await removeImageBuildProgress(e.id)
                     
                    }))
                }
                return result.status === 200 ? true : false;
            })
            .catch((err) => {
                return false;
            });
        return result;
    }
};
//delete billingPayment by id

const postdatabuilding = async (data) => {
    console.log("postdatabuilding:",session);
    let statusRemove = 0, statusSuccess = 0
    let totalImage = []
    if (data.imageprogress !== null) {
        totalImage = await Promise.all(data.imageprogress.map(async (e) => {
            const resultUpload = await uploadImageBuildProgress(e.originFileObj)
            if (resultUpload.status === true) {


                return resultUpload.data[0]

            } else {
                statusSuccess = 1
            }
        }))
    }
    if (statusSuccess === 0) {
        const options = {
            headers: {
                "Content-Type": "application/json",
                Authorization:`Bearer ${auth}`
            }
        }
        const postData = {
            subject: data.subject,
            progress: data.progress,
            start_date: data.startproject,
            address: data.address,
            end_date: data.endproject,
            users_permissions_user: data.user,
            project:data.project,
             imageprogress: totalImage.length === 0 ? null : totalImage,
        };
        // console.log("postData", postData);
        const result = await axios
            .post(`${URLBuilding}`, postData, options)
            .then(async (res) => {
                return res.status === 200 ? true : false;
            })
            .catch((err) => {
                return false;
            });
        return result;

    } else {
        return false
    }

};

const uploadImageBuildProgress = async (image) => {
    if (image !== undefined && image !== null) {
        const image_building = new FormData();
        image_building.append('files', image)
        // console.log(image_building);
        const resultImage = await axios
            .post(
                imageURL,
                image_building,
                optionsImage
            )
            .then((result) => {
                // console.log("resultFormImage:", result.data);
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
const removeImageBuildProgress = async (imageID) => {
    const resultRemoveImage = await axios.delete(`${imageURL}/files/${imageID}`,options).then((result) => {
        // console.log("removeImage:",result.data);
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

const editBuilding = async (buildingID, data) => {
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
            const result = await removeImageBuildProgress(e.id)
        }))
    }
  
    if (resultImageUpload.length > 0) {
        totalImage = await Promise.all(resultImageUpload.map(async (e) => {
            const resultUpload = await uploadImageBuildProgress(e.originFileObj)
            if (resultUpload.status === true) {

                image2.push(resultUpload.data[0])
                return resultUpload.data[0]

            } else {
                statusSuccess = 1
            }
        }))
        console.log("totalImage:",totalImage);
    }
    
    if (statusRemove === 0 && statusSuccess === 0) {
        // console.log("status:",statusRemove,statusSuccess);
        // const resulst = data.imageDefult.filter((e) => {
        //     console.log("allImage:",e);
        //     return data.imageprogress.includes(e)
        // })
        let allImage = null
        allImage=image2
        // if (totalImage.length === 0) {
        //     allImage = resulst
        // } else {
        //     allImage = resulst.concat(totalImage)
        // }
    
        const
            postData = {
                subject: data.subject,
                progress: data.progress,
                startproject: data.startproject,
                // address: data.address,
                endproject: data.endproject,
                // users_permissions_user: user,
                imageprogress: allImage.length === 0 ? null : allImage,
            };
         console.log("postDataEdit:", postData);
        const result = await axios
            .put(`${URLBuilding}/${buildingID}`,postData,options)
            .then(async (res) => {
                return res.status === 200 ? true : false;
            })
            .catch((err) => {
                return false;
            });
        return result;
    }


}
export {
    getDataBuilding, deleteBuilding, postdatabuilding, editBuilding, getCountBuildList,
    uploadImageBuildProgress, removeImageBuildProgress
};
