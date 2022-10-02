/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import {Button,Image,Input,Row,Col,DatePicker,Form,Modal,Select,Upload,notification} from 'antd';
import { EditFixReport } from '../api/fix_report_api'
import axios from 'axios';
import moment from 'moment';
import ImgCrop from 'antd-img-crop';
import { format, utcToZonedTime } from 'date-fns-tz';
import { encryptStorage } from '../../../utils/encryptStorage';
import { socket } from '../../../services/webSocketService';
import { useSelector, useDispatch } from 'react-redux';
import { getDataFixReport } from '../service/thunk-action/fix_report_thunk'
const previewImage = {
  previewVisible: false,
  previewImage: "",
  previewTitle: "",
};
export default function ReportModal() {
  const { dataManageReport,statusModalFixReport,paramsFixReport } = useSelector((state) => state.FixReportActionRedux);
  const dispatch = useDispatch();
  const session = encryptStorage.getItem('user_session');
  const URLreScript = process.env.REACT_APP_API_URL + '/fixing-reports';
  const headers = { headers: { Authorization: 'Bearer ' + session.jwt } };
  const thTimeZone = 'Asia/Bangkok';
  const { Option } = Select;
  const status = {
    Pending: '#E86A6B',
    Repairing: '#EEC84D',
    Success: '#79CA6C',
  };
  const [form] = Form.useForm();
  const [repairReq, setRepairReq] = useState(true);
  const [successReq, setSuccessReq] = useState(true);
  const [pendingImgFile, setPendingImgFile] = useState([]);
  const [repairingImgFile, setRepairingImgFile] = useState([]);
  const [successImgFile, setSuccessImgFile] = useState([]);
  const [PreviewImg, setPreviewImg] = useState(previewImage);
  const [statusFixreportList, setstatusFixreportList] = useState(null);
  //pendingImg
  const [fileListPending, setFileListPending] = useState(null);
  const [oldFilePending, setoldFilePending] = useState(null);
  const [pendingImg, setpendingImg] = useState(true);
    //RepairImg
    const [fileListRepairing, setFileListRepairing] = useState(null);
    const [oldFileRepairing, setoldFileRepairing] = useState(null);
    const [RepairingImg, setRepairingImg] = useState(true);
      //pendingImg
  const [fileListSuccess, setFileListSuccess] = useState(null);
  const [oldFileSuccess, setoldFileSuccess] = useState(null);
  const [SuccessImg, setSuccessImg] = useState(true);
  function disabledDate(current) {
    return current && current < moment().startOf('day');
  }
  const handleValue = async () => {
  await  form.setFieldsValue({
      pick_up_date: dataManageReport?.[0]?.pick_up_date
        ? moment(
            format(
              utcToZonedTime(new Date(dataManageReport?.[0]?.pick_up_date), thTimeZone),
              'yyyy-MM-dd',
              { timeZone: 'Asia/Bangkok' }
            )
          )
        : '',
      opening_date: dataManageReport?.[0]?.opening_date
        ? moment(
            format(
              utcToZonedTime(new Date(dataManageReport?.[0]?.opening_date), thTimeZone),
              'yyyy-MM-dd',
              { timeZone: 'Asia/Bangkok' }
            )
          )
        : '',
      closing_date: dataManageReport?.[0]?.closing_date
        ? moment(
            format(
              utcToZonedTime(new Date(dataManageReport?.[0]?.closing_date), thTimeZone),
              'yyyy-MM-dd',
              { timeZone: 'Asia/Bangkok' }
            )
          )
        : '',
      status: dataManageReport?.[0]?.status,
      cause: dataManageReport?.[0]?.cause,
      solution: dataManageReport?.[0]?.solution,
    });
    const {Repairing,Success}=status
  switch (dataManageReport?.[0]?.status) {
    case "Pending":
      setRepairReq(true);
      setSuccessReq(true);
      setpendingImg(false)
      setstatusFixreportList({Repairing,Success})
      break;
    case "Repairing":
      setRepairReq(false);
      setSuccessReq(true);
      setRepairingImg(false)
      setstatusFixreportList({Success})
      break;
    case "Success":
      setRepairReq(false);
      setSuccessReq(false);
      setSuccessImg(false)
      break;
  
    default:
      break;
  }
    await setFileListPending( dataManageReport?.[0]?.image_pending)
    await setFileListRepairing( dataManageReport?.[0]?.image_repairing)
    await setFileListSuccess( dataManageReport?.[0]?.image_success)
  };

  useEffect(async () => {
     await handleValue();
  
  }, [dataManageReport]);

  const imagePreviewSty = {
    border: '1px solid #959595',
    borderRadius: '10px',
    margin: '4px',
    width: '16vh',
    height: '16vh',
  };

  function statusHandle(status) {
    console.log('statusHandle', status);
  }
  //repairingImg
  const removeImageRepairing = async (file) => {
    let totalImage2 = [], removeImage2 = []
    fileListRepairing?.map((e) => {
        if (e.uid !== file.uid) {
            totalImage2.push(e)
        }
        if (e.uid === file.uid && e.id !== undefined) {
            removeImage2.push(e)
        }
    });
    await setFileListRepairing(totalImage2.length === 0 ? null : totalImage2);
    if (oldFileRepairing !== null) {
        let result = oldFileRepairing.concat(removeImage2)
        setoldFileRepairing(result)
    } else {
        setoldFileRepairing(removeImage2)
    }
};

const handleChangeRepairing = async ({fileList}) => {
    
    let data = [];
    const result = fileList.filter(async (e, i) => {
        if (e.status !== "error") {
            data.push(e);
            return e;
        }
      
    });

    await setFileListRepairing(data);
};

const dummyRequestRepairing = ({file, onSuccess, onError}) => {
    if (file.size > 209715200) {
        notification["error"]({
            duration: 2,
            message: "Upload image",
            description: "image size more than 200 MB.",
            style: {borderRadius: "25px"},
        });
        setTimeout(() => {
            onError("error");
        }, 0);
        //209715200 = 200mb
    } else {
        setTimeout(() => {
            onSuccess("ok");
        }, 0);
    }
};
  //repairingImg

    //successImg
    const removeImageSuccess = async (file) => {
      let totalImage2 = [], removeImage2 = []
      fileListSuccess?.map((e) => {
          if (e.uid !== file.uid) {
              totalImage2.push(e)
          }
          if (e.uid === file.uid && e.id !== undefined) {
              removeImage2.push(e)
          }
      });
      await setFileListSuccess(totalImage2.length === 0 ? null : totalImage2);
      if (oldFileSuccess !== null) {
          let result = oldFileSuccess.concat(removeImage2)
          setoldFileSuccess(result)
      } else {
          setoldFileSuccess(removeImage2)
      }
  };
  
  const handleChangeSuccess = async ({fileList}) => {
      let data = [];
      const result = fileList.filter(async (e, i) => {
          if (e.status !== "error") {
              data.push(e);
              return e;
          }
        
      });
      await setFileListSuccess(data);
  };
  
  const dummyRequestSuccess = ({file, onSuccess, onError}) => {
     
      if (file.size > 209715200) {
          notification["error"]({
              duration: 2,
              message: "Upload image",
              description: "image size more than 200 MB.",
              style: {borderRadius: "25px"},
          });
          setTimeout(() => {
              onError("error");
          }, 0);
          //209715200 = 200mb
      } else {
          setTimeout(() => {
              onSuccess("ok");
          }, 0);
      }
  };
    //successImg

      //pendingImg
  const removeImagePending = async (file) => {
    let totalImage2 = [], removeImage2 = []
    fileListPending?.map((e) => {
        if (e.uid !== file.uid) {
            totalImage2.push(e)
        }
        if (e.uid === file.uid && e.id !== undefined) {
            removeImage2.push(e)
        }
    });
    await setFileListPending(totalImage2.length === 0 ? null : totalImage2);
    if (oldFilePending !== null) {
        let result = oldFilePending.concat(removeImage2)
        setoldFilePending(result)
    } else {
        setoldFilePending(removeImage2)
    }
};

const handleChangePending = async ({fileList}) => {
   
    let data = [];
    const result = fileList.filter(async (e, i) => {
        if (e.status !== "error") {
            data.push(e);
            return e;
        }
        
    });
  
    await setFileListPending(data);
};

const dummyRequestPending = ({file, onSuccess, onError}) => {
    
    if (file.size > 209715200) {
        notification["error"]({
            duration: 2,
            message: "Upload image",
            description: "image size more than 200 MB.",
            style: {borderRadius: "25px"},
        });
        setTimeout(() => {
            onError("error");
        }, 0);
        //209715200 = 200mb
    } else {
        setTimeout(() => {
            onSuccess("ok");
        }, 0);
    }
};
  //pendingImg

  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
};

const onPreview = async (file) => {
    if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
    }
    await setPreviewImg((prevState) => {
        return {
            ...prevState,
            previewImage: file.url || file.preview,
            previewVisible: true,
            previewTitle:
                file.name || file.url.substring(file.url.lastIndexOf("/") + 1),
        };
    });
};

const handlerOk=async () => {
 await form
    .validateFields()
    .then(async (values) => {
    
      const newValues = {
        pick_up_date:values.pick_up_date
        ? `${values.pick_up_date.format('yyyy-MM-DD')}T00:00:00.000+07:00`
        : '',
      opening_date:values.opening_date
        ? `${values.opening_date.format('yyyy-MM-DD')}T00:00:00.000+07:00`
        : '',
      closing_date:values.closing_date
        ? `${values.closing_date.format('yyyy-MM-DD')}T00:00:00.000+07:00`
        : '',
      oldStatus: dataManageReport?.[0]?.status,
      status: values.status,
      cause:values.cause,
      solution:values.solution,
      owner:dataManageReport?.[0]?.address.owner,
      problem:dataManageReport?.[0]?.problem
      }
      switch (dataManageReport?.[0]?.status) {
        case "Pending":
          newValues.imageprogress= fileListPending
          newValues.imageDefult= dataManageReport?.[0]?.image_pending
          newValues.oldImages= oldFilePending !== null ? oldFilePending : null
          newValues.image_repairing=dataManageReport?.[0]?.image_repairing
          newValues.image_success=dataManageReport?.[0]?.image_success
          break;
        case "Repairing":
          newValues.imageprogress= fileListRepairing
          newValues.imageDefult= dataManageReport?.[0]?.image_repairing
          newValues.oldImages= oldFileRepairing !== null ? oldFileRepairing : null
          newValues.image_pending= dataManageReport?.[0]?.image_pending
          newValues.image_success=dataManageReport?.[0]?.image_success
          break;
        case "Success":
          newValues.imageprogress= fileListSuccess
          newValues.imageDefult= dataManageReport?.[0]?.image_success
          newValues.oldImages= oldFileSuccess !== null ? oldFileSuccess : null
          newValues.image_pending= dataManageReport?.[0]?.image_pending
          newValues.image_repairing=dataManageReport?.[0]?.image_repairing
          break;
      
        default:
          break;
      }
      // console.log('====================================');
      // console.log("newvalues:",values);
      // console.log('====================================');
      // return
      const resultPostData = await EditFixReport(dataManageReport?.[0].id, newValues);
      if (resultPostData) {
          notification["success"]({
              duration: 2,
              message: "Fixreport",
              description: "Edit fix report successfully.",
              style: {borderRadius: "25px"},
          });
          await form.resetFields();
          await setpendingImg(true)
          await setRepairingImg(true)
          await setSuccessImg(true)
           dispatch(getDataFixReport(paramsFixReport));
           dispatch({ type: 'MODAL_FIX_REPORT', payload: false })
      } else {

          notification["error"]({
              duration: 2,
              message: "Fixreport",
              description: "Edit fix report failed.",
              style: {borderRadius: "25px"},
          });
      }
    })
    .catch((info) => {
      console.log('Validate Failed:', info);
    });
}

const handleEditReport = async (value) => {
  console.log('value', value, value.key);

  axios
    .put(
      `${URLreScript}/${dataManageReport?.[0]?.id}`,
      {
        pick_up_date: value.pick_up_date
          ? `${value.pick_up_date.format('yyyy-MM-DD')}T00:00:00.000+07:00`
          : '',
        opening_date: value.opening_date
          ? `${value.opening_date.format('yyyy-MM-DD')}T00:00:00.000+07:00`
          : '',
        closing_date: value.closing_date
          ? `${value.closing_date.format('yyyy-MM-DD')}T00:00:00.000+07:00`
          : '',
        status: dataManageReport?.[0]?.status,
        cause: value.cause,
        solution: value.solution,
      },
      headers
    )
    .then((res) => {
      socket.emit('reportStatus', {});
      console.log('res', res);
      if (
        pendingImgFile.length > 0 &&
        repairingImgFile.length > 0 &&
        successImgFile.length > 0
      ) {
        uploadImg();
      } else {
        uploadImg();
       
      }
    })
    .catch((err) => {
      console.error("Can't add data: ", err);
    });
    await  dispatch(getDataFixReport(paramsFixReport));
    await dispatch({ type: 'MODAL_FIX_REPORT', payload: false })
};

const uploadImg = async () => {
  if (pendingImgFile.length > 0) {
    let arr = [];
    dataManageReport?.[0]?.image_pending.map((item) => arr.push(item));
    for (let i = 0; i < pendingImgFile.length; i++) {
      let dataImage = new FormData();
      dataImage.append('files', pendingImgFile[i]);
      console.log('dataImage', dataImage);
      console.log('pendingImgFile', i, pendingImgFile[i]);
      dataImage
        ? await axios
            .post(
              process.env.REACT_APP_API_URL + '/upload/',
              dataImage,
              headers
            )
            .then((res) => {
              let imageId = res.data[0];
              console.log('imageId', imageId);
              arr.push(imageId);
              console.log('arr', arr);
              axios
                .put(
                  `${URLreScript}/${dataManageReport?.[0]?.id}`,
                  {
                    image_pending: arr,
                  },
                  headers
                )
                .then((res) => {
                  
                })
                .catch((err) => {
                  console.error("Can't add data: ", err);
                });
            })
            .catch((err) => {
              //console.log("ERROR", err);
            })
        : alert('noImage');
    }
  }
  if (repairingImgFile.length > 0) {
    let arr = [];
    dataManageReport?.[0]?.image_repairing.map((item) => arr.push(item));
    for (let i = 0; i < repairingImgFile.length; i++) {
      let dataImage = new FormData();
      dataImage.append('files', repairingImgFile[i]);
      console.log('dataImage', dataImage);
      console.log('repairingImgFile', i, repairingImgFile[i]);
      dataImage
        ? await axios
            .post(
              process.env.REACT_APP_API_URL + '/upload/',
              dataImage,
              headers
            )
            .then((res) => {
              let imageId = res.data[0];
              console.log('imageId', imageId);
              arr.push(imageId);
              console.log('arr', arr);
              axios
                .put(
                  `${URLreScript}/${dataManageReport?.[0]?.id}`,
                  {
                    image_repairing: arr,
                  },
                  headers
                )
                .then((res) => {
                  
                })
                .catch((err) => {
                  console.error("Can't add data: ", err);
                });
            })
            .catch((err) => {
              console.log('ERROR', err);
            })
        : alert('noImage');
    }
  }
  if (successImgFile.length > 0) {
    let arr = [];
    dataManageReport?.[0]?.image_success.map((item) => arr.push(item));
    for (let i = 0; i < successImgFile.length; i++) {
      let dataImage = new FormData();
      dataImage.append('files', successImgFile[i]);
      console.log('dataImage', dataImage);
      console.log('successImgFile', i, successImgFile[i]);
      dataImage
        ? await axios
            .post(
              process.env.REACT_APP_API_URL + '/upload/',
              dataImage,
              headers
            )
            .then((res) => {
              let imageId = res.data[0];
              console.log('imageId', imageId);
              arr.push(imageId);
              console.log('arr', arr);
              axios
                .put(
                  `${URLreScript}/${dataManageReport?.[0]?.id}`,
                  {
                    image_success: arr,
                  },
                  headers
                )
                .then((res) => {
                  
                })
                .catch((err) => {
                  console.error("Can't add data: ", err);
                });
            })
            .catch((err) => {
              console.log('ERROR', err);
            })
        : alert('noImage');
    }
  }
};

  return (
    <Modal
      visible={statusModalFixReport}
      title="Manage Report"
      footer={[
        <Button
          style={{
            backgroundColor: '#D8AA81',
            color: '#F5F4EC',
          }}
          className="add-btn"
          key="add"
          onClick={ async()=>{
            dispatch({ type: 'MODAL_FIX_REPORT', payload: false }) 
            await handleValue()
          await setpendingImg(true)
          await setRepairingImg(true)
          await setSuccessImg(true)
        }}
        >
          Cancel
        </Button>,
        <Button
          style={{
            backgroundColor: '#D8AA81',
            color: '#F5F4EC',
          }}
          className="add-btn"
          key="add"
          onClick={handlerOk}
        >
          OK
        </Button>,
      ]}
      onCancel={ async()=>{
        dispatch({ type: 'MODAL_FIX_REPORT', payload: false }) 
        await handleValue()
        await setpendingImg(true)
          await setRepairingImg(true)
          await setSuccessImg(true)
      }}
      width={'70%'}
    >
      <Form
        form={form}
        layout="vertical"
        name="form_in_modal"
        initialValues={{
          modifier: 'public',
        }}
        style={{ display: 'flex' }}
      >
        <div className="report-form" style={{ flex: 1 }}>
          <Form.Item label="Owner">
            <div className="divText">
              <p className="disableText">{dataManageReport?.[0]?.owner}</p>
            </div>
          </Form.Item>
          <Form.Item label="Submission Date" name="submission_date">
            <div className="divText">
              <p className="disableText">{dataManageReport?.[0]?.submission_date}</p>
            </div>
          </Form.Item>
          <Form.Item
            name="opening_date"
            label="Resolution Due By"
            rules={[
              {
                required: repairReq ? false : true,
                message: 'Please select Resolution Due By',
              },
            ]}
          >
            <DatePicker
              disabledDate={disabledDate}
              className="dateTime"
              disabled={repairReq ? true : false}
            />
          </Form.Item>
          <Form.Item
            name="status"
            label="Status"
            rules={[
              {
                required: true,
                message: 'Please select type',
              },
            ]}
          >
            <Select   disabled={dataManageReport?.[0]?.status ==="Success"? true :false} style={{ width: '100%' }} onChange={statusHandle}>
              { statusFixreportList !== null ?Object.keys(statusFixreportList).map((type, index) => (
                <Option value={type} key={index}>
                  {type}
                </Option>
              )):null}
            </Select>
          </Form.Item>
          <Form.Item label="Problem">
            <div className="divText">
              <p className="disableText">{dataManageReport?.[0]?.problem}</p>
            </div>
          </Form.Item>
          {/* <Form.Item label="Pending">
            <input
              type="file"
              id="inputPending"
              accept="image/*"
              onChange={selectPendingImg}
              onClick={(event) => {
                event.target.value = null;
              }}
              style={{ display: 'none', float: 'left' }}
            />
            <PendingImages />
          </Form.Item> */}
            <div className="col-sm" style={{paddingTop: 10}}>
                        <p>
                        Pending
                            {fileListPending !== null && fileListPending?.length > 0
                                ? ` : ${fileListPending.length} of 3`
                                : null}
                        </p>

                        <ImgCrop rotate>
                            <Upload
                                customRequest={dummyRequestPending}
                                accept=".png, .jpg"
                                listType="picture-card"
                                disabled={pendingImg}
                                fileList={fileListPending}
                                onChange={handleChangePending}
                                onRemove={removeImagePending}
                                onPreview={onPreview}
                            >
                                {fileListPending == null || fileListPending.length < 3 ? "+ Upload" : null}
                            </Upload>
                        </ImgCrop>
                    </div>
         {/* reparing */}
         <div className="col-sm" style={{paddingTop: 10}}>
                        <p>
                        Repairing
                            {fileListRepairing !== null && fileListRepairing?.length > 0
                                ? ` : ${fileListRepairing.length} of 3`
                                : null}
                        </p>

                        <ImgCrop rotate>
                            <Upload
                                customRequest={dummyRequestRepairing}
                                accept=".png, .jpg"
                                listType="picture-card"
                                disabled={RepairingImg}
                                fileList={fileListRepairing}
                                onChange={handleChangeRepairing}
                                onRemove={removeImageRepairing}
                                onPreview={onPreview}
                            >
                                {fileListRepairing == null || fileListRepairing.length < 3 ? "+ Upload" : null}
                            </Upload>
                        </ImgCrop>
                    </div>
                    {/* success */}
                    <div className="col-sm" style={{paddingTop: 10}}>
                        <p>
                            Success
                            {fileListSuccess !== null && fileListSuccess?.length > 0
                                ? ` : ${fileListSuccess.length} of 3`
                                : null}
                        </p>

                        <ImgCrop rotate>
                            <Upload
                                customRequest={dummyRequestSuccess}
                                accept=".png, .jpg"
                                listType="picture-card"
                                disabled={SuccessImg}
                                fileList={fileListSuccess}
                                onChange={handleChangeSuccess}
                                onRemove={removeImageSuccess}
                                onPreview={onPreview}
                            >
                                {fileListSuccess == null || fileListSuccess.length < 3 ? "+ Upload" : null}
                            </Upload>
                        </ImgCrop>
                    </div>
        </div>
        <div style={{ width: 45 }}></div>
        <div className="report-form" style={{ flex: 1 }}>
          <Form.Item label="Address">
            <div className="divText">
              <p className="disableText">{dataManageReport?.[0]?.address_number}</p>
            </div>
          </Form.Item>
          <Form.Item
            name="pick_up_date"
            label="First Response"
            rules={[
              {
                required: repairReq ? false : true,
                message: 'Please select First Response',
              },
            ]}
          >
            <DatePicker
              disabledDate={disabledDate}
              className="dateTime"
              disabled={ pendingImg ? true : false}
            />
          </Form.Item>
          <Form.Item
            name="closing_date"
            label="Closing Case"
            rules={[
              {
                required: successReq ? false : true,
                message: 'Please select Closing Case',
              },
            ]}
          >
            <DatePicker
              disabledDate={disabledDate}
              className="dateTime"
              disabled={successReq ? true : false}
            />
          </Form.Item>
          {/* <Form.Item label="Type">
            <div className="divText">
              <p className="disableText">{dataManageReport?.[0]?.type}</p>
            </div>
          </Form.Item> */}
          <Form.Item label="Description">
            <div className="divArea">
              <p className="disableText">{dataManageReport?.[0]?.description}</p>
            </div>
          </Form.Item>
          <Form.Item
            name="cause"
            label="Cause"
            rules={[
              {
                required: successReq ? false : true,
                message: 'Please enter cause',
              },
            ]}
          >
            <Input.TextArea
              placeholder="Please input details"
              style={{
                padding: '8px',
                borderRadius: '10px',
                minHeight: '20vh',
              }}
              disabled={repairReq ? true : false}
            />
          </Form.Item>
          <Form.Item
            name="solution"
            label="Solution"
            rules={[
              {
                required: successReq ? false : true,
                message: 'Please enter solution',
              },
            ]}
          >
            <Input.TextArea
              placeholder="Please input details"
              style={{
                padding: '8px',
                borderRadius: '10px',
                minHeight: '20vh',
              }}
              disabled={successReq ? true : false}
            />
          </Form.Item>
        </div>
      </Form>
       <Modal
          visible={PreviewImg?.previewVisible}
          title={PreviewImg?.previewTitle}
          footer={null}
          onCancel={async () => {
              await setPreviewImg((prevState) => {
                      return {
                        ...prevState,
                        // totalAmount: sum.toFixed(2),
                        previewVisible: false,
                        };
                      });
                  }}
          >
          <img
            alt="example"
            style={{width: "100%"}}
            src={PreviewImg?.previewImage}
                    />
                </Modal>
    </Modal>
  );
}
