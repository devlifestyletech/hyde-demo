import React, { useState, useEffect } from "react";
import Heading from "../../components/Heading";
import {
  Button, Table, Image, Input, Row, Col, Popconfirm, DatePicker, Form, Modal,
  TimePicker,
} from "antd";
import { FormOutlined, DeleteOutlined, PictureOutlined } from "@ant-design/icons";
import axios from "axios";
import { encryptStorage } from "../../../config/encrypt";

const session = encryptStorage.getItem("user_session");
const URLreScript = process.env.REACT_APP_API_URL + "/fixing-reports/";
const { format } = require('date-fns');
const ManageReport = ({ visible, onCancel }) => {
  const [form] = Form.useForm();
  const [publishPicked, setPublishPicked] = useState();
  const [pickedImage, setPickedImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
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
      .post(process.env.REACT_APP_API_URL + "upload/", dataImage)
      .then((res) => {
        console.log("res", res);
        let imageId = res.data[0];
        axios
          .post(
            `${URLreScript}`,
            {
              title_name: `${value["title_name"]}`,
              post_status: `${value["publish_status"]}`,
              announcer: "Admin1",
              detail: `${value["detail"]}`,
              date_announce: datePicked ? `${datePicked}` : `${dateNow}`,
              time_announce: timePicked
                ? `${timePicked}:00.000`
                : `${timeNow}:00.000`,
              image: imageId,
            },
            {
              headers: { Authorization: "Bearer " + session.jwt },
            }
          )
          .then((res) => {
          })
          .catch((err) => {
            console.error("Can't add data: ", err);
          });
      })
      .catch((err) => {
        console.log("ERROR", err);
      });
  };

  const uploadImg = async () => {
    let dataImage = new FormData();
    dataImage.append("image", imageFile);
    console.log('imageFile', imageFile)
    dataImage ?
      await axios
        .post(process.env.REACT_APP_API_URL + "upload/", dataImage)
        .then((res) => {
          console.log("res", res);
          // let imageId = res.data[0];
        })
        .catch((err) => {
          console.log("ERROR", err);
        }) : alert('noImage')
  }

  return (
    <Modal
      visible={visible}
      title="Manage Report"
      footer={[
        <Button
          style={{
            backgroundColor: "#B2A37A",
            color: "#F5F4EC",
          }}
          className="add-btn"
          key="add"
          onClick={() => uploadImg()}
        >
          Cancel
        </Button>,
        <Button
          style={{
            backgroundColor: "#B2A37A",
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
                handleOnAdd(newValues);
              })
              .catch((info) => {
                console.log("Validate Failed:", info);
              });
          }}
        >
          OK
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
          {publishPicked === "Scheduled" ? (
            <div className="flex-container">
              <div style={{ flex: 1 }}>
                <Form.Item
                  name="date"
                  label="Date"
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
                  name="time"
                  label="Time"
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
        </div>
      </Form>
    </Modal>
  );
};

export default ManageReport;