import React, {useState, useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Button, notification, Input, Modal, Table, Menu, DatePicker, Space, Upload, Form, Select} from "antd";
import moment from "moment";
import {
    PlusOutlined,
    MinusCircleOutlined,
} from "@ant-design/icons";
import {editBuilding} from "../../services/API/building_API";
import {DataBuildingStore} from '../../services/thunk-action/building_thunk';
import ImgCrop from 'antd-img-crop';
import GoogleMapReact from 'google-map-react';

const {RangePicker} = DatePicker;
const {Option} = Select;
const locationList = [
    {name: "Bangkok", status: false, value: "Bangkok"},
    {name: "Samut Prakan", status: false, value: "Samut Prakan"},
    {name: "Nonthaburi", status: false, value: "Nonthaburi"},
    {name: "Pathum Thani", status: false, value: "Pathum Thani"},
    {name: "Phra Nakhon Si Ayutthaya", status: false, value: "Phra Nakhon Si Ayutthaya"},
    {name: "Ang Thong", status: false, value: "Ang Thong"},
    {name: "Loburi", status: false, value: "Loburi"},
    {name: "Sing Buri", status: false, value: "Sing Buri"},
    {name: "Chai Nat", status: false, value: "Chai Nat"},
    {name: "Saraburi", status: false, value: "Saraburi"},
    {name: "Chon Buri", status: false, value: "Chon Buri"},
    {name: "Rayong", status: false, value: "Rayong"},
    {name: "Chanthaburi", status: false, value: "Chanthaburi"},
    {name: "Trat", status: false, value: "Trat"},
    {name: "Chachoengsao", status: false, value: "Chachoengsao"},
    {name: "Prachin Buri", status: false, value: "Prachin Buri"},
    {name: "Nakhon Nayok", status: false, value: "Nakhon Nayok"},
    {name: "Sa Kaeo", status: false, value: "Sa Kaeo"},
    {name: "Nakhon Ratchasima", status: false, value: "Nakhon Ratchasima"},
    {name: "Buri Ram", status: false, value: "Buri Ram"},
    {name: "Surin", status: false, value: "Surin"},
    {name: "Si Sa Ket", status: false, value: "Si Sa Ket"},
    {name: "Ubon Ratchathani", status: false, value: "Ubon Ratchathani"},
    {name: "Yasothon", status: false, value: "Yasothon"},
    {name: "Chaiyaphum", status: false, value: "Chaiyaphum"},
    {name: "Amnat Charoen", status: false, value: "Amnat Charoen"},
    {name: "Nong Bua Lam Phu", status: false, value: "Nong Bua Lam Phu"},
    {name: "Khon Kaen", status: false, value: "Khon Kaen"},
    {name: "Udon Thani", status: false, value: "Udon Thani"},
    {name: "Loei", status: false, value: "Loei"},
    {name: "Nong Khai", status: false, value: "Nong Khai"},
    {name: "Maha Sarakham", status: false, value: "Maha Sarakham"},
    {name: "Roi Et", status: false, value: "Roi Et"},
    {name: "Kalasin", status: false, value: "Kalasin"},
    {name: "Sakon Nakhon", status: false, value: "Sakon Nakhon"},
    {name: "Nakhon Phanom", status: false, value: "Nakhon Phanom"},
    {name: "Mukdahan", status: false, value: "Mukdahan"},
    {name: "Chiang Mai", status: false, value: "Chiang Mai"},
    {name: "Lamphun", status: false, value: "Lamphun"},
    {name: "Lampang", status: false, value: "Lampang"},
    {name: "Uttaradit", status: false, value: "Uttaradit"},
    {name: "Phrae", status: false, value: "Phrae"},
    {name: "Nan", status: false, value: "Nan"},
    {name: "Phayao", status: false, value: "Phayao"},
    {name: "Chiang Rai", status: false, value: "Chiang Rai"},
    {name: "Mae Hong Son", status: false, value: "Mae Hong Son"},
    {name: "Nakhon Sawan", status: false, value: "Nakhon Sawan"},
    {name: "Uthai Thani", status: false, value: "Uthai Thani"},
    {name: "Kamphaeng Phet", status: false, value: "Kamphaeng Phet"},
    {name: "Tak", status: false, value: "Tak"},
    {name: "Sukhothai", status: false, value: "Sukhothai"},
    {name: "Phitsanulok", status: false, value: "Phitsanulok"},
    {name: "Phichit", status: false, value: "Phichit"},
    {name: "Phetchabun", status: false, value: "Phetchabun"},
    {name: "Ratchaburi", status: false, value: "Ratchaburi"},
    {name: "Kanchanaburi", status: false, value: "Kanchanaburi"},
    {name: "Suphan Buri", status: false, value: "Suphan Buri"},
    {name: "Nakhon Pathom", status: false, value: "Nakhon Pathom"},
    {name: "Samut Sakhon", status: false, value: "Samut Sakhon"},
    {name: "Samut Songkhram", status: false, value: "Samut Songkhram"},
    {name: "Phetchaburi", status: false, value: "Phetchaburi"},
    {name: "Prachuap Khiri Khan", status: false, value: "Prachuap Khiri Khan"},
    {name: "Nakhon Si Thammarat", status: false, value: "Nakhon Si Thammarat"},
    {name: "Krabi", status: false, value: "Krabi"},
    {name: "Phangnga", status: false, value: "Phangnga"},
    {name: "Phuket", status: false, value: "Phuket"},
    {name: "Surat Thani", status: false, value: "Surat Thani"},
    {name: "Ranong", status: false, value: "Ranong"},
    {name: "Chumphon", status: false, value: "Chumphon"},
    {name: "Songkhla", status: false, value: "Songkhla"},
    {name: "Satun", status: false, value: "Satun"},
    {name: "Trang", status: false, value: "Trang"},
    {name: "Phatthalung", status: false, value: "Phatthalung"},
    {name: "Pattani", status: false, value: "Pattani"},
    {name: "Yala", status: false, value: "Yala"},
    {name: "Narathiwat", status: false, value: "Narathiwat"},
    {name: "buogkan", status: false, value: "buogkan"}
];
const previewImage = {
    previewVisible: false,
    previewImage: "",
    previewTitle: "",
};

const ModalEdit = () => {
    const dispatch = useDispatch();
    const {statusModalEdit, dataEdit,paramsBuildingProgress} = useSelector(
        (state) => state.BuildProgressActionRedux
    );
    const [fileList, setFileList] = useState(null);
    const [PreviewImg, setPreviewImg] = useState(previewImage);
    const [oldFile, setoldFile] = useState(null);

    const [form] = Form.useForm(); //upload
    useEffect(async () => {
        await form.setFieldsValue({
            dateTime: [moment(dataEdit?.startproject), moment(dataEdit?.endproject)],
            building: dataEdit?.progress,
            ProjectName: dataEdit?.subject,
            location: dataEdit?.address,
        });
        await setFileList(dataEdit?.imageprogress);
        // console.log("edit:",dataEdit);
        // await setoldFile(dataEdit?.imageprogress);
    }, [dataEdit]);

    const handleCancel = async () => {
        await setoldFile(null)
        await form.setFieldsValue({
            dateTime: [moment(dataEdit?.startproject), moment(dataEdit?.endproject)],
            building: dataEdit?.progress,
            ProjectName: dataEdit?.subject,
            location: dataEdit?.address,
        });
        await setFileList(dataEdit?.imageprogress);

        await dispatch({type: "MODAL_EDIT"});
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

    const handleOk = async () => {

        await form
            .validateFields()
            .then(async (values) => {
                values["building"].map((e)=>{
                  e.persentage= parseInt(e.persentage)
                   })
                const allValuesForm = {
                    imageprogress: fileList,
                    imageDefult: dataEdit?.imageprogress,
                    oldImages: oldFile !== null ? oldFile : null,
                    address: values["location"],
                    progress: values["building"],
                    startproject: values["dateTime"][0].format("YYYY-MM-DD"),
                    endproject: values["dateTime"][1].format("YYYY-MM-DD"),
                    subject: values["ProjectName"],
                };

                console.log("allValuesForm:", allValuesForm);
                const resultPostData = await editBuilding(dataEdit.id, allValuesForm);
                if (resultPostData) {
                    notification["success"]({
                        duration: 2,
                        message: "EditBuildProgress",
                        description: "Edit Build Progress successfully.",
                        style: {borderRadius: "25px"},
                    });
                    await form.resetFields();
                    dispatch(DataBuildingStore(paramsBuildingProgress))
                    await dispatch({type: "MODAL_EDIT"});
                } else {

                    notification["error"]({
                        duration: 2,
                        message: "EditBuildProgress",
                        description: "Edit Build Progress failed.",
                        style: {borderRadius: "25px"},
                    });
                }

            })
            .catch((info) => {
                // console.log("Validate Failed:", info);
            });
        // await setModalCreateBill((prevState) => {
        //   return {
        //     ...prevState,
        //     billingInvoiceID: "AT" + new Date().getTime(),
        //   };
        // });
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
        await setFileList(totalImage2.length === 0 ? null : totalImage2);
        if (oldFile !== null) {
            let result = oldFile.concat(removeImage2)
            setoldFile(result)
        } else {
            setoldFile(removeImage2)
        }
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
    return (
        <Modal
            title="Edit Project"
            visible={statusModalEdit}
            onOk={handleOk}
            onCancel={handleCancel}
            width={"60%"}
        >
            <>
                <Form
                    // initialValues={{
                    //   dateTime: [
                    //     moment(dataEdit?.startproject),
                    //     moment(dataEdit?.endproject),
                    //   ],
                    //   building: dataEdit?.progress,
                    //   ProjectName: dataEdit?.subject,
                    //   location:dataEdit?.address
                    // }}
                    form={form}
                    name="buildProgress"
                    autoComplete="off"
                >
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-sm">
                                <div>
                                    <p>Project Name</p>
                                    <Form.Item
                                        name="ProjectName"
                                        rules={[
                                            {
                                                required: true,
                                                message: "Pleases input ProjectName.",
                                            },
                                        ]}
                                    >
                                        <Input
                                            style={{borderRadius: "25em"}}
                                            placeholder="Please input project name"
                                            disabled={false}
                                        />
                                    </Form.Item>
                                </div>
                            </div>
                            <div className="col-sm">
                                <div>
                                    <p>Dua Date</p>
                                    <Form.Item
                                        name="dateTime"
                                        rules={[
                                            {
                                                required: true,
                                                message: "Pleases selected date range.",
                                            },
                                        ]}
                                    >
                                        <RangePicker/>
                                    </Form.Item>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Form.Item
                        name={"location"}
                        label={"location"}
                        rules={[
                            {
                                required: true,
                                message: "select location",
                            },
                        ]}
                    >
                        <Select
                            showSearch
                            style={{width: 200}}
                            placeholder="select location"
                            // defaultValue={dataEdit?.address}
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                        >
                            {locationList.map((e) => {
                                return (
                                    <Option key={e} value={e.value}>
                                        {e.name}
                                    </Option>
                                );
                            })}
                        </Select>
                    </Form.Item>
                    <div className="col-sm" style={{paddingTop: 10}}>
                        <p>Project Progresses</p>
                        <Form.List
                            name="building"
                            rules={[
                                ({getFieldValue}) => ({
                                    validator(rule, value) {
                                        // console.log("value:", value);
                                        if (value === undefined || value.length < 1) {
                                            return Promise.reject(
                                                "please add build progress detail."
                                            );
                                        }

                                        return Promise.resolve();
                                    },
                                }),
                            ]}
                        >
                            {(fields, {add, remove}, {errors}) => (
                                <>
                                    {fields.map((field) => (
                                        <Space key={field.key} align="baseline">
                                            <Form.Item
                                                {...field}
                                                label="Input name"
                                                name={[field.name, "name"]}
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: "Missing Name detail",
                                                    },
                                                    ({getFieldValue}) => ({
                                                        validator(rule, value) {
                                                            const rexp = /^[a-z A-Zก-๖]+$/;
                                                            if (
                                                                !isNaN(value) ||
                                                                value === undefined ||
                                                                !rexp.test(value)
                                                            ) {
                                                                return Promise.reject("invalid name");
                                                            }

                                                            return Promise.resolve();
                                                        },
                                                    }),
                                                ]}
                                            >
                                                <Input/>
                                            </Form.Item>
                                            <Form.Item
                                                {...field}
                                                label="Input percent"
                                                name={[field.name, "persentage"]}
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: "Missing persentage",
                                                    },
                                                    ({getFieldValue}) => ({
                                                        validator(rule, value) {
                                                            const rexp = /^[0-9]+$/;
                                                            if (
                                                                isNaN(value) ||
                                                                value === undefined ||
                                                                !rexp.test(value)
                                                            ) {
                                                                return Promise.reject("invalid number");
                                                            } else {
                                                                console.log(value);
                                                                if (Number(value) > 100) {
                                                                    return Promise.reject("number over than 100 persentage");
                                                                }
                                                            }

                                                            return Promise.resolve();
                                                        },
                                                    }),
                                                ]}
                                            >
                                                <Input/>
                                            </Form.Item>

                                            <Form.Item
                                                {...field}
                                                label="Input detail"
                                                name={[field.name, "detail"]}
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: "Missing Name detail",
                                                    },
                                                ]}
                                            >
                                                <Input/>
                                            </Form.Item>

                                            <MinusCircleOutlined
                                                onClick={() => remove(field.name)}
                                            />
                                        </Space>
                                    ))}

                                    <Form.Item>
                                        <Button
                                            type="dashed"
                                            onClick={() => add()}
                                            block
                                            icon={<PlusOutlined/>}
                                        >
                                            Add Progress
                                            <Form.ErrorList errors={errors}/>
                                        </Button>
                                    </Form.Item>
                                </>
                            )}
                        </Form.List>
                    </div>

                    <div className="col-sm" style={{paddingTop: 10}}>
                        <p>
                            Upload
                            {fileList !== null && fileList?.length > 0
                                ? `: ${fileList.length} of 4`
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
                                {fileList == null || fileList.length < 4 ? "+ Upload" : null}
                            </Upload>
                        </ImgCrop>
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
            </>
        </Modal>
    );
};

export default ModalEdit;
