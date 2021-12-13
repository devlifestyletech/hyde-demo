/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from "react";
import Heading from "../../components/Header";
import {
  Button,
  Table,
  Image,
  Input,
  Modal,
  Form,
  Select,
  Col,
  Row,
  DatePicker,
  TimePicker,
  Popconfirm,
  Divider
} from "antd";
import {
  PlusOutlined,
  PictureOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import axios from "axios";
import moment from "moment";
import "./style/announcementsStyle.css";
// import { format } from "date-fns";
import { format, utcToZonedTime } from 'date-fns-tz'


import editIcon from "./assets/icons/edit.svg";
import trashIcon from "./assets/icons/trash.svg";
import noImg from "./assets/images/noImg.jpg";

import { encryptStorage } from "../../utils/encryptStorage";
const session = encryptStorage.getItem("user_session");

function Announcement() {
  const URLreScript = process.env.REACT_APP_API_URL + "/announcements/";
  const headers = { headers: { Authorization: "Bearer " + session.jwt } };

  const types = [
    "All Post",
    "Published to All",
    "Scheduled",
  ];

  const publish = ["Now", "Scheduled"];
  const { Search } = Input;
  const { Option } = Select;
  const { MonthPicker } = DatePicker;
  const thTimeZone = 'Asia/Bangkok'
  const [data, setData] = useState([]);
  const [month, setMonth] = useState();
  const [searchName, setSearchName] = useState("");
  const [searchTag, setSearchTag] = useState("All Post");
  const [newVisible, setNewVisible] = useState(false);
  const [value, setValue] = useState(null);
  const [editVisible, setEditVisible] = useState(false);

  const showEditModal = () => {
    setEditVisible(true);
  };

  const closeEditModal = () => {
    setEditVisible(false);
  };

  const showModal = () => {
    setNewVisible(true);
  };

  const closeModal = () => {
    setNewVisible(false);
  };

  const handleSearch = (value) => {
    setSearchName(value.toLowerCase());
  };

  const handleSearchChange = (value) => {
    if (value.target.value === "") {
      setSearchName("");
    }
  };

  let columns = [
    {
      width: '2vw',
      title: "No.",
      dataIndex: "number",
      key: "number",
      sorter: (a, b) => a.number - b.number,
    },
    {
      width: '10vw',
      title: "Picture",
      dataIndex: "picture",
      key: "picture",
      render: (_, image) => (
        <>
          <Image width={200} height={100}
            src={
              image?.image?.url
                ? process.env.REACT_APP_API_URL + image.image.url
                : noImg
            } alt={image.image.url} />
        </>
      ),
    },
    {
      title: "Title",
      dataIndex: "title_name",
      key: "title_name",
    },
    {
      width: '8vw',
      title: "Post Status",
      dataIndex: "post_status",
      key: "post_status",
      sorter: (a, b) => (a.post_status > b.post_status ? 1 : -1),
    },
    {
      width: '10vw',
      title: "Date Announced",
      dataIndex: "date_announced_show",
      key: "date_announced_show",
    },
    {
      width: '10vw',
      title: "Date Expired",
      dataIndex: "date_expired_show",
      key: "date_expired_show",
    },
    {
      width: '10vw',
      title: "Announcer",
      dataIndex: "announcer",
      key: "announcer",
    },
    {
      width: 100,
      title: "Action",
      dataIndex: "operation",
      render: (_, record) => (
        <Row justify="space-between">
          <Col>
            <Popconfirm
              icon={<EditOutlined />}
              title="Sure to Edit?"
              onConfirm={() => handleEdit(record)}
            >
              <img src={editIcon} alt="Edit" />
            </Popconfirm>
          </Col>
          <Col> <Divider type='vertical' style={{ height: 30 }} />
          </Col>
          <Col>
            <Popconfirm
              icon={<DeleteOutlined style={{ color: "red" }} />}
              title="Sure to delete?"
              onConfirm={() => handleDelete(record.key)}
            >
              <img src={trashIcon} alt="Trash" />
            </Popconfirm>
          </Col>
        </Row>
      ),
    },
  ].filter((item) => !item.hidden);

  const handleEdit = async (record) => {
    console.log("Edit", record);
    setValue(record);
    showEditModal();
  };

  const handleDelete = async (key) => {
    console.log("record.name", key);
    await axios
      .delete(`${URLreScript}${key}`, headers)
      .then((result) => {
        fetchData();
        console.log("delete:", result);
        return result.status === 200 ? true : false;
      })
      .catch((err) => {
        return false;
      });
  };

  useEffect(() => {
    console.log('session', session.user.fullname)
    console.log('session', session.jwt)
    let today = new Date().toISOString()
    var expires = moment(new Date()).toISOString(true)
    // let dateNow = format(today, "yyyy-MM-dd");
    // let timeNow = format(today, "HH:mm");
    console.log("today", today, expires);
    // console.log("Date", dateNow);
    // console.log("Time", timeNow);
    fetchData();
  }, []);

  useEffect(() => {
    // console.log(month);
  }, [month]);

  const fetchData = () => {
    axios
      .get(URLreScript, headers)
      .then((response) => {
        console.log("data", response.data);
        let originData = [];



        response.data.forEach((announce, index) => {
          let date_an = format(utcToZonedTime(new Date(announce.date_announced), thTimeZone), 'dd MMM yyyy HH:mm', { timeZone: 'Asia/Bangkok' });
          let date_ex = format(utcToZonedTime(new Date(announce.date_expired), thTimeZone), 'dd MMM yyyy HH:mm', { timeZone: 'Asia/Bangkok' });
          console.log('date', date_an, date_ex)
          let announceData = { key: index, number: index + 1, date_announced_show: date_an, date_expired_show: date_ex, ...announce };
          console.log(index, announceData)
          originData.push(announceData)
        })
        setData(originData);
      });
  };

  const EditAnnouncement = ({ visible, editValue, onCancel }) => {
    const [form] = Form.useForm();
    const [publishPicked, setPublishPicked] = useState(editValue.post_status);
    const [pickedImage, setPickedImage] = useState(editValue.picture);
    const [imageFile, setImageFile] = useState(null);
    const [datePicked, setDatePicked] = useState("");
    const [timePicked, setTimePicked] = useState("");
    console.log("editValue.date " + editValue.date_announced);

    let date_an = format(utcToZonedTime(new Date(editValue.date_announced), thTimeZone), 'yyyy-MM-dd HH:mm', { timeZone: 'Asia/Bangkok' });
    let date_ex = format(utcToZonedTime(new Date(editValue.date_expired), thTimeZone), 'yyyy-MM-dd HH:mm', { timeZone: 'Asia/Bangkok' });

    const handleValue = () => {
      form.setFieldsValue({
        title_name: editValue.title,
        detail: editValue.detail,
        publish_status: editValue.post_status,
        schedule_date: editValue.post_status === "Scheduled" ? moment(date_an.split(' ')[0]) : "",
        schedule_time:
          editValue.post_status === "Scheduled"
            ? moment(date_an.split(' ')[1], "HH:mm")
            : "",
        expire_date: moment(date_ex.split(' ')[0]),
        expire_time: moment(date_ex.split(' ')[1], "HH:mm"),
      });
    };

    useEffect(() => {
      handleValue();
      // setDatePicked(dateEdit);
      // setTimePicked(timeEdit);
    }, []);

    function onDateChange(date, dateString) {
      console.log("date", date);
      console.log("dateString", dateString);
      setDatePicked(dateString);
    }
    function onTimeChange(time, timeString) {
      console.log("time", time);
      console.log("timeString", timeString);
      setTimePicked(timeString);
    }

    const deleteHandle = () => {
      setPickedImage(null);
    };

    function publishPickedHandle(key) {
      console.log("publishPickedHandle", key);
      setPublishPicked(key);
    }

    console.log("rerender modal");

    const selectHandle = (e) => {
      setImageFile(e.target.files[0]);
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setPickedImage(reader.result);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    };

    const handleEditChange = async (value) => {
      console.log("value", value);
      let today = Date.now();
      let dateNow = format(today, "yyyy-MM-dd");
      let timeNow = format(today, "HH:mm");
      console.log("today", today);
      console.log("Date", dateNow, datePicked);
      console.log("Time", timeNow, timePicked);
      let dataImage = new FormData();
      dataImage.append("files", imageFile);

      if (imageFile == null) {
        axios
          .put(
            `${URLreScript}${editValue.key}`,
            {
              title_name: `${value["title_name"]}`,
              post_status: `${value["publish_status"]}`,
              announcer: session.user.fullname,
              detail: `${value["detail"]}`,
              date_announce:
                editValue.post_status === "Scheduled"
                  ? `${datePicked}`
                  : `${dateNow}`,
              time_announce:
                editValue.post_status === "Scheduled"
                  ? `${timePicked}:00.000+07:00`
                  : `${timeNow}:00.000+07:00`,
            },
            headers
          )
          .then((res) => {
            fetchData();
            closeEditModal();
          })
          .catch((err) => {
            console.error("Can't add data: ", err);
          });
      } else {
        await axios
          .post(process.env.REACT_APP_API_URL + " /upload/", dataImage)
          .then((res) => {
            console.log("res", res);
            let imageId = res.data[0];
            axios
              .put(
                `${URLreScript}${editValue.key}`,
                {
                  title_name: `${value["title_name"]}`,
                  post_status: `${value["publish_status"]}`,
                  announcer: session.user.fullname,
                  detail: `${value["detail"]}`,
                  date_announce:
                    editValue.post_status === "Scheduled"
                      ? `${datePicked}`
                      : `${dateNow}`,
                  time_announce:
                    editValue.post_status === "Scheduled"
                      ? `${timePicked}:00.000`
                      : `${timeNow}:00.000`,
                  image: imageId,
                }, headers
              )
              .then((res) => {
                fetchData();
                closeEditModal();
              })
              .catch((err) => {
                console.error("Can't add data: ", err);
              });
          })
          .catch((err) => {
            console.log("ERROR", err);
          });
      }
    };

    return (
      <Modal
        visible={visible}
        title="Edit Announcement"
        footer={[
          <Button
            style={{
              backgroundColor: "#D8AA81",
              color: "#F5F4EC",
            }}
            className="add-btn"
            key="add"
            onClick={() => {
              form
                .validateFields()
                .then((values) => {
                  let newValues = {
                    ...values,
                  };
                  form.resetFields();
                  handleEditChange(newValues);
                })
                .catch((info) => {
                  console.log("Validate Failed:", info);
                });
            }}
          >
            Edit
          </Button>,
        ]}
        onCancel={onCancel}
        width={960}
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
            <Form.Item
              name="title_name"
              label="Title"
              rules={[
                {
                  required: true,
                  message: "Please input title",
                },
              ]}
            >
              <Input
                placeholder="Please input title"
                style={{ borderRadius: 20 }}
              />
            </Form.Item>
            <Form.Item label="Image">
              <div>
                {pickedImage ? null : (
                  <div className="inputImage">
                    <label htmlFor="input">
                      <div
                        class="child"
                        style={{
                          width: "100%",
                          height: "40vh",
                          textAlign: "center",
                        }}
                      >
                        <Col>
                          <PictureOutlined
                            style={{
                              width: "100%",
                              fontSize: 64,
                              color: "#818282",
                            }}
                          />
                          Click to this area to upload
                        </Col>
                      </div>
                    </label>
                  </div>
                )}
                <input
                  type="file"
                  id="input"
                  accept="image/*"
                  onChange={selectHandle}
                  onClick={(event) => {
                    event.target.value = null;
                  }}
                  style={{ display: "none", float: "left" }}
                />
                {pickedImage ? (
                  <div>
                    <img
                      style={{ width: "100%", height: "50vh" }}
                      src={pickedImage}
                      alt="test"
                    />
                  </div>
                ) : null}
                <div style={{ marginTop: 12 }}>
                  {pickedImage ? (
                    <div className="delete">
                      <Button style={{ float: "right" }} onClick={deleteHandle}>
                        Delete
                      </Button>
                    </div>
                  ) : null}
                </div>
              </div>
            </Form.Item>
          </div>
          <div style={{ width: 45 }}></div>
          <div style={{ flex: 1 }}>

            <Form.Item
              name="detail"
              label="Details"
              rules={[
                {
                  required: true,
                  message: "Please input details",
                },
              ]}
            >
              <Input.TextArea
                placeholder="Please input details"
                style={{ minHeight: "40vh" }}
              />
            </Form.Item>
            <Form.Item
              name="publish_status"
              label="Publish"
              rules={[
                {
                  required: true,
                  message: "Please select type",
                },
              ]}
            >
              <Select style={{ width: "100%" }} onChange={publishPickedHandle}>
                {publish.map((type, index) => (
                  <Option value={type} key={index}>
                    {type}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            {publishPicked === "Scheduled" ? (
              <div className="flex-container">
                <div style={{ flex: 1 }}>
                  <Form.Item
                    name="schedule_date"
                    label="Scheduled Date"
                    rules={[
                      {
                        type: "date",
                        required: true,
                        message: "Please select date",
                      },
                    ]}
                  >
                    <DatePicker className="dateTime" onChange={onDateChange} />
                  </Form.Item>
                </div>
                <div style={{ width: 10 }}></div>
                <div style={{ flex: 1 }}>
                  <Form.Item
                    name="schedule_time"
                    label="Schedule Time"
                    rules={[
                      {
                        type: "object",
                        required: true,
                        message: "Please select time",
                      },
                    ]}
                  >
                    <TimePicker
                      className="dateTime"
                      onChange={onTimeChange}
                      format="HH:mm"
                    />
                  </Form.Item>
                </div>
              </div>
            ) : null}
            <div className="flex-container">
              <div style={{ flex: 1 }}>
                <Form.Item
                  name="expire_date"
                  label="Expiration date"
                  rules={[
                    {
                      type: "date",
                      required: true,
                      message: "Please select date",
                    },
                  ]}
                >
                  <DatePicker className="dateTime" onChange={onDateChange} />
                </Form.Item>
              </div>
              <div style={{ width: 10 }}></div>
              <div style={{ flex: 1 }}>
                <Form.Item
                  name="expire_time"
                  label="Expiration Time"
                  rules={[
                    {
                      type: "object",
                      required: true,
                      message: "Please select time",
                    },
                  ]}
                >
                  <TimePicker
                    className="dateTime"
                    onChange={onTimeChange}
                    format="HH:mm"
                  />
                </Form.Item>
              </div>
            </div>


          </div>
        </Form>
      </Modal>
    );
  };

  const CreateAnnouncement = ({ visible, onCancel }) => {
    const [form] = Form.useForm();
    const [publishPicked, setPublishPicked] = useState();
    const [pickedImage, setPickedImage] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [imageBorder, setImageBorder] = useState('inputImage');
    const [datePicked, setDatePicked] = useState("");
    const [timePicked, setTimePicked] = useState("");

    function onDateChange(date, dateString) {
      console.log("date", date);
      console.log("dateString", dateString);
      setDatePicked(dateString);
    }
    function onTimeChange(time, timeString) {
      console.log("time", time);
      console.log("timeString", timeString);
      setTimePicked(timeString);
    }

    const deleteHandle = () => {
      setPickedImage(null);
      setImageFile(null);
    };

    function publishPickedHandle(key) {
      console.log("publishPickedHandle", key);
      setPublishPicked(key);
    }

    console.log("rerender modal1");

    const selectHandle = (e) => {
      setImageFile(e.target.files[0]);
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setPickedImage(reader.result);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    };


    const isFirstRun = useRef(true);
    useEffect(() => {
      if (isFirstRun.current) {
        isFirstRun.current = false;
        return;
      } else {
        if (pickedImage) { setImageBorder('inputImage') }
        else { setImageBorder('inputNoImage') }
      }
    }, [pickedImage]);

    const handleOnAdd = async (value) => {
      console.log("value", value);
      let today = Date.now();
      let dateNow = format(today, "yyyy-MM-dd");
      let timeNow = format(today, "HH:mm");
      console.log("today", today);
      console.log("Date", dateNow, datePicked);
      console.log("Time", timeNow, timePicked);

      // console.log("value time", value["time"]);
      let dataImage = new FormData();
      dataImage.append("files", imageFile);
      await axios
        .post(process.env.REACT_APP_API_URL + " /upload/", dataImage)
        .then((res) => {
          console.log("res", res);
          let imageId = res.data[0];
          axios
            .post(
              `${URLreScript}`,
              {
                title_name: `${value["title_name"]}`,
                post_status: `${value["publish_status"]}`,
                announcer: session.user.fullname,
                detail: `${value["detail"]}`,
                date_announce: datePicked ? `${datePicked}` : `${dateNow}`,
                time_announce: timePicked
                  ? `${timePicked}:00.000`
                  : `${timeNow}:00.000`,
                image: imageId,
              }, headers
            )
            .then((res) => {
              fetchData();
              closeModal();
            })
            .catch((err) => {
              console.error("Can't add data: ", err);
            });
        })
        .catch((err) => {
          console.log("ERROR", err);
        });
    };

    return (
      <Modal
        visible={visible}
        title="Create Announcement"
        footer={[
          <Button
            style={{
              backgroundColor: "#D8AA81",
              color: "#F5F4EC",
            }}
            className="add-btn"
            key="add"
            onClick={() => {
              form
                .validateFields()
                .then((values) => {
                  if (pickedImage) {
                    let newValues = {
                      ...values,
                    };
                    form.resetFields();
                    handleOnAdd(newValues);
                  } else { setImageBorder('inputNoImage') }
                })
                .catch((info) => {
                  setImageBorder('inputNoImage')
                  console.log("Validate Failed:", info);
                });
            }}
          >
            Publish
          </Button>,
        ]}
        onCancel={onCancel}
        width={960}
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
            <Form.Item
              name="title_name"
              label="Title"
              rules={[
                {
                  required: true,
                  message: "Please input title",
                },
              ]}
            >
              <Input
                placeholder="Please input title"
                style={{ borderRadius: 20 }}
              />
            </Form.Item>
            <Form.Item
              label={<div><span style={{ color: '#ff4d4f', fontSize: 10, position: 'relative', bottom: 5 }}>* </span>Image</div>}
            >
              <div>
                {pickedImage ? null : (
                  <div className={imageBorder}>
                    <label htmlFor="input">
                      <div
                        class="child"
                        style={{
                          width: "100%",
                          height: "40vh",
                          textAlign: "center",
                        }}
                      >
                        <Col>
                          <PictureOutlined
                            style={{
                              width: "100%",
                              fontSize: 64,
                              color: "#818282",
                            }}
                          />
                          Click to this area to upload
                        </Col>
                      </div>
                    </label>
                  </div>
                )}
                <input
                  type="file"
                  id="input"
                  accept="image/*"
                  onChange={selectHandle}
                  onClick={(event) => {
                    event.target.value = null;
                  }}
                  style={{ display: "none", float: "left" }}
                />
                {pickedImage ? (
                  <div>
                    <img
                      style={{ width: "100%", height: "40vh" }}
                      src={pickedImage}
                      alt="test"
                    />
                  </div>
                ) : null}
                {imageBorder === 'inputNoImage' ? <span style={{ color: '#ff4d4f' }}>Please input details</span> : null}
                <div style={{ marginTop: 12 }}>
                  {pickedImage ? (
                    <div className="delete">
                      <Button style={{ float: "right" }} onClick={deleteHandle}>
                        Delete
                      </Button>
                    </div>
                  ) : null}
                </div>
              </div>
            </Form.Item>
          </div>
          <div style={{ width: 45 }}></div>
          <div style={{ flex: 1 }}>
            <Form.Item
              name="detail"
              label="Details"
              rules={[
                {
                  required: true,
                  message: "Please input details",
                },
              ]}
            >
              <Input.TextArea
                placeholder="Please input details"
                style={{ minHeight: "20vh" }}
              />
            </Form.Item>
            <Form.Item
              name="publish_status"
              label="Publish"
              rules={[
                {
                  required: true,
                  message: "Please select type",
                },
              ]}
            >
              <Select style={{ width: "100%" }} onChange={publishPickedHandle}>
                {publish.map((type, index) => (
                  <Option value={type} key={index}>
                    {type}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            {publishPicked === "Scheduled" ? (
              <div className="flex-container">
                <div style={{ flex: 1 }}>
                  <Form.Item
                    name="schedule_date"
                    label="Scheduled Date"
                    rules={[
                      {
                        type: "date",
                        required: true,
                        message: "Please select date",
                      },
                    ]}
                  >
                    <DatePicker className="dateTime" onChange={onDateChange} />
                  </Form.Item>
                </div>
                <div style={{ width: 10 }}></div>
                <div style={{ flex: 1 }}>
                  <Form.Item
                    name="schedule_time"
                    label="Scheduled Time"
                    rules={[
                      {
                        type: "object",
                        required: true,
                        message: "Please select time",
                      },
                    ]}
                  >
                    <TimePicker
                      className="dateTime"
                      onChange={onTimeChange}
                      format="HH:mm"
                    />
                  </Form.Item>
                </div>
              </div>
            ) : null}
            <div className="flex-container">
              <div style={{ flex: 1 }}>
                <Form.Item
                  name="expire_date"
                  label="Expiration date"
                  rules={[
                    {
                      type: "date",
                      required: true,
                      message: "Please select date",
                    },
                  ]}
                >
                  <DatePicker className="dateTime" onChange={onDateChange} />
                </Form.Item>
              </div>
              <div style={{ width: 10 }} />
              <div style={{ flex: 1 }}>
                <Form.Item
                  name="expire_time"
                  label="Expiration Time"
                  rules={[
                    {
                      type: "object",
                      required: true,
                      message: "Please select time",
                    },
                  ]}
                >
                  <TimePicker
                    className="dateTime"
                    onChange={onTimeChange}
                    format="HH:mm"
                  />
                </Form.Item>
              </div>
            </div>
          </div>
        </Form >
      </Modal >
    );
  };

  function onMonthChange(date, dateString) {
    console.log("date", date);
    console.log("dateString", dateString);
    setMonth(dateString)
  }

  return (
    <>
      <Heading title="Announcements" />
      <div align="right">
        <Button
          size="large"
          shape="round"
          icon={<PlusOutlined />}
          style={{
            marginTop: 10,
            backgroundColor: "#D8AA81",
            color: "#F5F4EC",
            alignSelf: "end",
          }}
          onClick={showModal}
        >
          Create Announcement
        </Button>
      </div>
      <MonthPicker
        style={{ width: 369, marginBottom: 19, marginRight: 10 }}
        onChange={onMonthChange}
        placeholder="Select month"
      />
      <Search
        placeholder="Search by title"
        allowClear
        onSearch={handleSearch}
        style={{ width: 200, marginBottom: 19 }}
        onChange={handleSearchChange}
        className="search-box"
      />
      <Table
        columns={columns}
        dataSource={
          searchTag === "All Post"
            ? searchName === ""
              ? data
              : data.filter((item) =>
                item.title.toLowerCase().includes(searchName)
              )
            : searchName === ""
              ? data.filter((item) => item.post_status.includes(searchTag))
              : data.filter(
                (item) =>
                  item.post_status.includes(searchTag) &&
                  item.title.toLowerCase().includes(searchName)
              )
        }
      />
      {value != null ? (
        <EditAnnouncement
          visible={editVisible}
          editValue={value}
          onCancel={closeEditModal}
        />
      ) : null}
      {newVisible ? (
        <CreateAnnouncement
          visible={newVisible}
          onCancel={() => {
            setNewVisible(false);
          }}
        />
      ) : null}
    </>
  );
}

export default Announcement;