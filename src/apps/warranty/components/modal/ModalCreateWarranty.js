import React, { useState, useEffect} from "react";
import {addWarranty} from '../../API/warranty_API'
import {compose} from 'recompose'
import {
  Button,
  Input,
  Modal,
  AutoComplete,
  DatePicker,
  notification,
  Form,
  Select,
  Col,
  Upload
} from "antd";
import {
  PlusOutlined,
  PictureOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import {getWarrantyProjectStore} from '../../services/thunk-action/Warranty_thunk'
import ImgCrop from 'antd-img-crop';
import { useSelector, useDispatch } from "react-redux";

const { Option } = Select;

const CreateWarrantyModal = (props) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [latitude, setLatitude] = useState(13.787664624326442);
    const [longitude, setLongitude] = useState(100.48204490167899);
    const [address, setAddress] = useState("");
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const {statusCreateWarranty,paramsWarranty } =useSelector((state) => state.WarrantyActionRedux);
    const [fileList, setFileList] = useState(null);
    const OnCancel = async () => {
      if (fileList != null) {
        fileList.map(async (e) => {
            await removeImage(e);
        });
    }
      dispatch({type: "CREATE_MODAL_Warranty"});
    };
    const handleOk = async () => {
        // console.log("ok:", form.getFieldValue());
        await form
            .validateFields()
            .then(async (values) => {
                const allValuesForm = {
                  Device_image:fileList,
                  WarrantyName:values["WarrantyName"],
                  SerialNumber:values["SerialNumber"],
                  PurchaseDate:values["PurchaseDate"].format("YYYY-MM-DD"),
                  ExpireDate:values["ExpireDate"].format("YYYY-MM-DD"),
                  owner:props?.UserWarranty?.owner.id,
                  address:props?.UserWarranty?.address.id
                }
                console.log("formValue:", allValuesForm);
                const resultPostData = await addWarranty(allValuesForm);
                if (resultPostData) {
                    notification["success"]({
                        duration: 2,
                        message: "CreateWarranty",
                        description: "Create Warranty successfully.",
                        style: { borderRadius: "25px" },
                    });
                    await  form.resetFields();
                    dispatch(getWarrantyProjectStore(paramsWarranty))
                    dispatch({type: "CREATE_MODAL_Warranty"});
                } else {

                    notification["error"]({
                        duration: 2,
                        message: "CreateWarranty",
                        description: "Create Warranty failed.",
                        style: { borderRadius: "25px" },
                    });
                }

            })

    };
    const dummyRequest = ({ file, onSuccess, onError }) => {
       console.log("dummyRes",file);
      if (file.size > 209715200) {
          notification["error"]({
              duration: 2,
              message: "Upload image",
              description: "image size more than 200 MB.",
              style: { borderRadius: "25px" },
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
  const handleChange = async ({ fileList }) => {
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
const removeImage = async (file) => {
  const totalImage = fileList.filter((e) => {
      return e.id !== file.id;
  });
  await setFileList(totalImage.length === 0 ? null : totalImage);
};
  const onPreview = async (file) => {
    let src = file.url;
    if (!src) {
        src = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file.originFileObj);
            reader.onload = () => resolve(reader.result);
        });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow.document.write(image.outerHTML);
};
  return  <Modal
    visible={statusCreateWarranty}
    title="Add Warranty"
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
        Add
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
        
        <div className="col" style={{ paddingTop: 10 }}>
                            <p>
                                Upload{" "}
                                {fileList !== null && fileList?.length > 0
                                    ? `: ${fileList.length} of 1`
                                    : null}
                            </p>
                            <ImgCrop rotate>
                        
                                <Upload
                                    customRequest={dummyRequest}
                                    accept=".png, .jpg"
                                    listType="picture-card"
                                
                                    fileList={fileList}
                                 
                                     onChange={handleChange}
                                     onRemove={removeImage}
                                     onPreview={onPreview}
                                >
                                   
                                    {fileList == null || fileList.length < 1
                                        ? "+ Upload"
                                        : null}
                                  
                                </Upload>
                            
                            </ImgCrop>

                    </div>
      </div>
    </Form>
  </Modal>
}
export default CreateWarrantyModal;

