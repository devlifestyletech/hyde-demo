import React, { useState, useEffect} from "react";
import {editWarranty} from '../../API/warranty_API'
import {compose} from 'recompose'
import {
  Button,
  Input,
  Modal,
  AutoComplete,
  DatePicker,
  notification,
  Form,
  Upload,
  Col,

} from "antd";
import {
  PlusOutlined,
  PictureOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import moment from "moment";
import ImgCrop from 'antd-img-crop';
import { useSelector, useDispatch } from "react-redux";
import {getWarrantyProjectStore} from '../../services/thunk-action/Warranty_thunk'
const previewImage = {
  previewVisible: false,
  previewImage: "",
  previewTitle: "",
};
const EditWarrantyModal = (props) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const {statusEditWarranty,paramsWarranty } =useSelector((state) => state.WarrantyActionRedux);
    const [statusImage, setstatusImage] = useState(false)
    const [fileList, setFileList] = useState(null);
    const [PreviewImg, setPreviewImg] = useState(previewImage);
    const [oldFile, setoldFile] = useState(null);
    const [form] = Form.useForm(); //upload
    useEffect( async () => {
      // console.log("testmodaledit:",props?.dataWarrantyEdit);
    form.setFieldsValue({
      WarrantyName:props?.dataWarrantyEdit?.device_name,
      SerialNumber:props?.dataWarrantyEdit?.serial_number,
      PurchaseDate:moment(props?.dataWarrantyEdit?.purchase_date),
    ExpireDate:moment(props?.dataWarrantyEdit?.expire_date),
    
     })
    setFileList(props?.dataWarrantyEdit?.device_image)
    setoldFile(props?.dataWarrantyEdit?.device_image)
    }, [props?.dataWarrantyEdit])
   
    const dispatch = useDispatch();
 


    const OnCancel = async () => {
    await  form.setFieldsValue({
        WarrantyName:props?.dataWarrantyEdit?.device_name,
        SerialNumber:props?.dataWarrantyEdit?.serial_number,
        PurchaseDate:moment(props?.dataWarrantyEdit?.purchase_date),
    ExpireDate:moment(props?.dataWarrantyEdit?.expire_date),
      
       })
       await  setFileList(props?.dataWarrantyEdit?.device_image)
      dispatch({type:"EDIT_WARRANTY"});
      await setstatusImage(false)
    };
    const handleOk = async () => {
        // console.log("ok:", form.getFieldValue());
        await form
            .validateFields()
            .then(async (values) => {
              const allValuesForm = {
                Device_image:fileList,
                old_image:oldFile,
                status_Image:statusImage,
                WarrantyName:values["WarrantyName"],
                SerialNumber:values["SerialNumber"],
                PurchaseDate:values["PurchaseDate"].format("YYYY-MM-DD"),
                ExpireDate:values["ExpireDate"].format("YYYY-MM-DD"),
                // owner:props?.UserWarranty?.owner.id,
                // address:props?.UserWarranty?.address.id
              }
                //  console.log("formValue:", allValuesForm);
                const resultPostData = await editWarranty(props?.dataWarrantyEdit?.id,allValuesForm);
                if (resultPostData) {
                    notification["success"]({
                        duration: 2,
                        message: "Edit Warranty",
                        description: "Edit Warranty successfully.",
                        style: { borderRadius: "25px" },
                    });
                    await  form.resetFields();
                    dispatch(getWarrantyProjectStore(paramsWarranty))
                    dispatch({type:"EDIT_WARRANTY"});
                } else {

                    notification["error"]({
                        duration: 2,
                        message: "Edit Warranty",
                        description: "Edit Warranty failed.",
                        style: { borderRadius: "25px" },
                    });
                }

            })
            await setstatusImage(false)
    };

    //up load

    const getBase64 = (file) => {
      return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = (error) => reject(error);
      });
  };

  const onPreview = async (file) => {
    // console.log("onPreview:",file);
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

    const removeImage = async (file) => {
      //  console.log("removeImage:",file);
      let totalImage2 = [], removeImage2 = []
      // const resultRemoveImage = await removeImageBuildProgress(file.id);
      // if (!resultRemoveImage.status) {
      //   notification["error"]({
      //     duration: 2,
      //     message: "remove image",
      //     description: "remove failed.",
      //     style: { borderRadius: "25px" },
      //   });
      //   return{status:false}
      // } else {
      fileList?.map((e) => {
          if (e.uid !== file.uid) {
              totalImage2.push(e)
          }
          if (e.uid === file.uid && e.id !== undefined) {
              removeImage2.push(e)
          }
      });
      await setstatusImage(true)
      // await setFileList(totalImage2.length === 0 ? null : totalImage2);
      // if (oldFile !== null) {
      //     let result = oldFile.concat(removeImage2)
      //     setoldFile(result)
      // } else {
      //     setoldFile(removeImage2)
      // }
      // console.log("remove new file:",newFile);
      // const totalNewImage = newFile?.filter((e) => {
      //   return e.id !== file.id;
      // });
      // await setNewFile(totalNewImage.length === 0 ? null : totalNewImage);
      //  return {status:true}
      // }
  };

  const handleChange = async ({fileList}) => {
      // console.log("handleChange_filelist:", fileList);
      let data = [];
      const result = fileList.filter(async (e, i) => {
          if (e.status !== "error") {
              data.push(e);
              return e;
          }
          // console.log("status:", e.status);
      });
      // console.log("result:", data);
      await setFileList(data);
  };

  const dummyRequest = ({file, onSuccess, onError}) => {
      // console.log("dummyRes",file);
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
  return  <Modal
    visible={statusEditWarranty}
    title="Edit Warranty"
    footer={[
      <Button
        style={{
          backgroundColor: "#B2A37A",
          color: "#F5F4EC",
        }}
        className="add-btn"
        key="add"
        onClick={handleOk}
      >
        Edit
      </Button>,
    ]}
     onCancel={OnCancel}
    width={633}
  >
    <Form
       form={form}
      layout="vertical"
      name="form_in_modal"
      initialValues={{
        modifier: "public",
      }}
      style={{ display: "flex" }}
    >
      <div style={{ flex: 1 }}>
        <div class="flex-container">
          <Col span={11}>
            <Form.Item
              name="WarrantyName"
              label="Warranty Name"
              rules={[
                {
                  required: true,
                  message: "Please input device name",
                },
              ]}
            >
              <Input
                placeholder="Please input device name"
                style={{ borderRadius: 20 }}
              />
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item
              name="SerialNumber"
              label="Serial Number"
              rules={[
                {
                  required: true,
                  message: "Please input Serial Number",
                },
              ]}
            >
              <Input
                placeholder="Please input Serial Number"
                style={{ borderRadius: 20 }}
              />
            </Form.Item>
          </Col>
        </div>
      
        <div class="flex-container">
          <Col span={11}>
            <Form.Item
              name="PurchaseDate"
              label="Purchase Date"
              rules={[
                {
                  required: true,
                  message: "Please input Purchase Date",
                },
              ]}
            >
               <DatePicker  />
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item
              name="ExpireDate"
              label="ExpireDate"
              rules={[
                {
                  required: true,
                  message: "Please input Expire Date",
                },
              ]}
            >
               <DatePicker  />
            </Form.Item>
          </Col>
        </div>

        <div className="warrnty" style={{paddingTop: 10}}>
                        <p>
                            Upload
                            {fileList !== null && fileList?.length > 0
                                ? `: ${fileList.length} of 1`
                                : null}
                        </p>

                        <ImgCrop rotate>
                            <Upload
                                customRequest={dummyRequest}
                                accept=".png, .jpg"
                                listType="picture-card"
                                //  beforeUpload={() => false}
                                // defaultFileList={
                                //   fileList
                                // }
                                fileList={fileList}
                                // beforeUpload={uploadImage}
                                onChange={handleChange}
                                onRemove={removeImage}
                                onPreview={onPreview}
                            >
                                {fileList == null || fileList.length < 1 ? "+ Upload" : null}
                            </Upload>
                        </ImgCrop>
                    </div>
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
}
export default EditWarrantyModal;