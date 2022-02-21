import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Input, TimePicker, Row, Col } from "antd";
import moment from "moment";

import { DeleteOutlined } from "@ant-design/icons";
import imgIcon from "../assets/img.svg";

export default function EditOccupation({
  visible,
  onCancel,
  id,
  roomName,
  roomDetail,
  mediumAt,
  highAt,
  image,
  onEdit,
  opened,
  closed,
}) {
  const [form] = Form.useForm();
  const [pickedImage, setPickedImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [img, setImg] = useState(null);
  // const [mediumClone, setMediumClone] = useState(0);
  // const [highClone, setHighClone] = useState(0);

  // functions
  const handleValue = () => {
    // setMediumClone(mediumAt);
    // setHighClone(highAt);
    form.setFieldsValue({
      roomName: roomName,
      roomDetail: roomDetail,
      highAt: highAt,
      mediumAt: mediumAt,
      opened: moment(opened, "HH:mm"),
      closed: moment(closed, "HH:mm"),
    });
  };

  const onConfirm = (value, files, id) => {
    Modal.confirm({
      centered: true,
      title: "Are you sure you want to edit occupation?",
      okButtonProps: { shape: "round", size: "large", type: "primary" },
      cancelButtonProps: { shape: "round", size: "large" },
      icon: null,
      autoFocusButton: null,
      onOk: () => {
        console.log("OK");
        console.log(value);
        console.log(id);
        onEdit(value, files, id);
        onCancel();
      },
      onCancel: () => {
        console.log("Cancel");
      },
    });
  };

  const selectHandle = (e) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setPickedImage(reader.result);
      }
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  //actions
  useEffect(() => {
    if (image) {
      setImg(image);
    }
    handleValue();
  }, [visible]);

  return (
    <>
      <Modal
        centered
        visible={visible}
        title="Edit Occupation"
        onCancel={() => {
          onCancel();
          setImg(null);
          console.log("set Null");
        }}
        footer={[
          <Button
            shape="round"
            size="large"
            type="primary"
            onClick={(e) => {
              e.preventDefault();
              form
                .validateFields()
                .then((values) => {
                  let newValues = {};

                  newValues = {
                    ...values,
                    // mediumAt: mediumClone,
                    // highAt: highClone,
                    opened: values["opened"].format("HH:mm:ss"),
                    closed: values["closed"].format("HH:mm:ss"),
                  };
                  form.resetFields();
                  // console.log(newValues);
                  onConfirm(newValues, imageFile, id);
                })
                .catch((info) => {
                  console.log("Validate Failed:", info);
                });
            }}
          >
            Save Change
          </Button>,
        ]}
      >
        <Form
          layout="vertical"
          form={form}
          name="form_in_modal"
          initialValues={{
            modifier: "public",
          }}
        >
          <div className="md-form">
            <Form.Item label="Room name" name="roomName">
              <Input />
            </Form.Item>
            <Form.Item label="Room detail" name="roomDetail">
              <Input />
            </Form.Item>
            <Form.Item label="Medium status will show at" name="mediumAt">
              <Input
                type={"number"}
                // value={mediumClone}
                // onChange={(val) => {
                //   setMediumClone(val);
                // }}
                min={0}
                style={{
                  borderRadius: 20,
                  marginRight: 20,
                }}
                suffix="Persons"
              />
            </Form.Item>
            <Form.Item label="High status will show at" name="highAt">
              <Input
                type={"number"}
                // value={highClone}
                // onChange={(val) => {
                //   setHighClone(val);
                // }}
                min={0}
                style={{
                  borderRadius: 20,
                  marginRight: 20,
                }}
                suffix="Persons"
              />
            </Form.Item>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Open at" name="opened">
                  <TimePicker format="HH:mm" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Close at" name="closed">
                  <TimePicker format="HH:mm" />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item label="Image" name="image">
              <div>
                {img ? (
                  <>
                    <img
                      className="facility-image"
                      src={process.env.REACT_APP_API_URL + img}
                      alt="bg"
                    />
                    <Button
                      icon={<DeleteOutlined />}
                      type="link"
                      style={{ float: "right" }}
                      onClick={() => setImg(false)}
                    >
                      Change Image
                    </Button>
                  </>
                ) : (
                  <>
                    {pickedImage ? (
                      <div>
                        <img
                          className="facility-image"
                          src={pickedImage}
                          alt="picked"
                        />
                        <Button
                          type="link"
                          icon={<DeleteOutlined />}
                          onClick={() => setPickedImage(null)}
                          style={{ float: "right" }}
                        >
                          Change image
                        </Button>
                      </div>
                    ) : (
                      <>
                        <label htmlFor="input">
                          <div className="facility-image">
                            <img
                              src={imgIcon}
                              alt="bg"
                              style={{ marginTop: 80 }}
                            />
                            <p>Click to upload image</p>
                          </div>
                        </label>
                        <input
                          type="file"
                          id="input"
                          accept="image/*"
                          onChange={(e) => {
                            // console.log(e.target.files);
                            setImageFile(e.target.files);
                            selectHandle(e);
                          }}
                          onClick={(event) => {
                            event.target.value = null;
                          }}
                          style={{
                            display: "none",
                            float: "left",
                          }}
                        />
                        <p style={{ color: "red" }}>* Please upload image</p>
                      </>
                    )}
                  </>
                )}
              </div>
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </>
  );
}
