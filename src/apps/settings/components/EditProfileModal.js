import React, { useState, useEffect } from 'react';
import { Button, Input, Modal, Form, Col, Row, Avatar } from 'antd';
import { PictureOutlined } from '@ant-design/icons';

const EditProfileModal = ({ visible, onAdd, onCancel, data }) => {
  const [files, setFiles] = useState();
  const [pickedImage, setPickedImage] = useState(null);
  const [form] = Form.useForm();

  const noSpacialRule = [
    {
      required: true,
      message: 'กรุณากรอกข้อมูล',
    },
    {
      pattern: new RegExp(/^[ก-๏a-zA-Z0-9 ]+$/i),
      message: 'ไม่สามารถใช้ตัวอักษรพิเศษ',
    },
  ];

  const telRule = [
    {
      required: true,
      message: 'กรุณากรอกเบอร์ติดต่อ',
    },
    {
      pattern: new RegExp(/^0[1-9][0-9]{8}/),
      message: 'เบอร์ติดต่อไม่ถูกต้อง',
    },
  ];

  const handleValue = () => {
    if (data != null) {
      form.setFieldsValue({
        name: data?.fullname,
        tel: data?.tel,
        email: data?.email,
        role: data?.role?.type,
      });
    } else {
      form.setFieldsValue({
        email: null,
        first_name_en: null,
        last_name_en: null,
        role: null,
      });
    }
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

  const deleteHandle = () => {
    setPickedImage(null);
    setFiles(null);
  };

  useEffect(() => {
    handleValue();
  }, [data]);

  return (
    <Modal
      visible={visible}
      title="Edit Profile"
      footer={[
        <Button
          className="add-btn"
          key="add"
          type="primary"
          size="large"
          onClick={(e) => {
            e.preventDefault();
            form
              .validateFields()
              .then((values) => {
                // form.resetFields();
                onAdd(values, files);
              })
              .catch((info) => {
                console.log('Validate Failed:', info);
              });
          }}
        >
          Save
        </Button>,
      ]}
      onCancel={() => {
        onCancel();
        setPickedImage(null);
      }}
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        name="form_in_modal"
        initialValues={{
          modifier: 'public',
        }}
        style={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Row align="middle" justify="center" style={{ flex: 1 }}>
          <Col span={24}>
            <Form.Item label="">
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignContent: 'center',
                  alignItems: 'center',
                }}
              >
                {pickedImage ? (
                  <div>
                    <Avatar size={300} src={pickedImage} />
                  </div>
                ) : (
                  <div
                    style={{
                      display: 'flex',
                      backgroundImage: `url(${process.env.REACT_APP_API_URL}${data?.avatar?.url})`,
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: 'cover',
                      width: 300,
                      height: 300,
                      borderRadius: 150,
                      alignContent: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <label htmlFor="input">
                      <div
                        style={{
                          display: 'flex',
                          alignContent: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <div
                          className="nearbyChild"
                          style={{
                            width: 300,
                            height: 300,
                            textAlign: 'center',
                            backgroundColor: 'rgba(52, 52, 52, 0.3)',
                            borderRadius: 150,
                          }}
                        >
                          <Col>
                            <PictureOutlined
                              style={{
                                fontSize: 64,
                                color: '#fff',
                              }}
                            />
                            <p style={{ color: '#fff' }}>
                              Click or drag file to this area to upload
                            </p>
                          </Col>
                        </div>
                      </div>
                    </label>
                  </div>
                )}
                <input
                  type="file"
                  id="input"
                  accept="image/*"
                  onChange={(e) => {
                    setFiles(e.target.files);
                    selectHandle(e);
                  }}
                  onClick={(event) => {
                    event.target.value = null;
                  }}
                  style={{ display: 'none', float: 'left' }}
                />
                <div style={{ marginTop: 12 }}>
                  {pickedImage ? (
                    <div className="delete" style={{ alignSelf: 'end' }}>
                      <Button style={{ float: 'right' }} onClick={deleteHandle}>
                        Delete
                      </Button>
                    </div>
                  ) : null}
                </div>
              </div>
            </Form.Item>
          </Col>
        </Row>
        <div style={{ width: 45 }}></div>
        <Row gutter={16} style={{ flex: 1 }}>
          <Col span={24}>
            <Form.Item rules={noSpacialRule} name="name" label="Name">
              <Input />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item rules={telRule} name="tel" label="Tel.">
              <Input />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item name="email" label="Email">
              <Input disabled={true} />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item name="role" label="Role">
              <Input disabled={true} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default EditProfileModal;
