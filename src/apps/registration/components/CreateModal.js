import React, { useState, useEffect } from 'react';
//import antd components
import {
  Modal,
  Button,
  Form,
  Row,
  Col,
  Input,
  message,
  DatePicker,
  Select,
} from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

import './styles/modal_style.css';
import { locale } from '../../../utils/locale';

//import services from "../services"
import addressService from '../../../services/addressServices';
import authService from '../../../services/authServices';

//import svg icon
import uploadService from '../../../services/uploadServices';
import ImageIcon from '../assets/icons/image.svg';

//antd variable constraints
const { Option } = Select;
const { confirm } = Modal;

function CreateModal({ visible, onCancel }) {
  const [CreateResidentForm] = Form.useForm();
  const [imageFile, setImageFile] = useState(null);
  const [pickedImage, setPickedImage] = useState(null);

  const selectImage = (e) => {
    setImageFile(e.target.files[0]);
    const reader = new FileReader();
    reader.onload = (e) => {
      if (reader.readyState === 2) {
        setPickedImage(reader.result);
      }
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  function showConfirm(value, imageData) {
    return confirm({
      centered: true,
      title: 'Are you sure you want to add?',
      icon: null,
      okButtonProps: { shape: 'round', size: 'large' },
      cancelButtonProps: { shape: 'round', size: 'large' },
      onOk() {
        return new Promise(async (resolve, reject) => {
          message.loading('Action in progress please wait...');
          try {
            const uploadImage = await uploadService.uploadImage(imageData);
            if (uploadImage) {
              const new_value = JSON.stringify({
                image: uploadImage.data[0],
                ...value,
              });
              try {
                const registered = await authService.registration(new_value);
                if (registered) {
                  message.success('Registration finished');
                  resolve('Success');
                  onCancel();
                }
              } catch (e) {
                console.error(e);
                reject(e);
              }
            }
          } catch (e) {
            console.error(e);
            reject(e);
          }
        });
      },
      onCancel() {
        return null;
      },
      bodyStyle: { borderRadius: 20 },
      maskStyle: { borderRadius: 20 },
      autoFocusButton: null,
    });
  }

  function makeUname(length) {
    let result = '';
    let characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  return (
    <div className="create_modal">
      <Modal
        title="Add New"
        visible={visible}
        onCancel={() => {
          onCancel();
          setPickedImage(null);
        }}
        width={950}
        footer={[
          <Button
            shape="round"
            size="large"
            style={{
              background: 'rgba(216, 170, 129, 1)',
              color: 'rgba(255, 255, 255,1)',
            }}
            onClick={async () => {
              let imageData = new FormData();
              imageData.append('files', imageFile);
              const value = await CreateResidentForm.validateFields();
              if (value) {
                let submit_value = {
                  username: 'hyde_' + makeUname(8),
                  email: value.email,
                  password: 'hyde_thonglor',
                  role: '61b40d9a268f0d019c9c0e7e',
                  fullname: value.firstname + ' ' + value.lastname,
                  firstname: value.firstname,
                  lastname: value.lastname,
                  tel: value.tel,
                  lp_number: value.lp_number,
                  birth_day: value.birth_day.toISOString(),
                  gender: value.gender,
                  nationality: value.nationality,
                  id_number: value.id_number,
                  passport_number: value.passport_number,
                  resident_class: value.resident_class,
                  vehicle_type: value.vehicle_type,
                  project: '61b464ff4abbaa01b461bc5f',
                };
                showConfirm(submit_value, imageData);
              }
            }}
          >
            Add
          </Button>,
        ]}
      >
        <Form form={CreateResidentForm} layout="vertical">
          <Row gutter={40} style={{ padding: 20 }}>
            <Col span={12}>
              <div className="md-form">
                <Form.Item label="Image">
                  <div className="select-img">
                    {pickedImage ? null : (
                      <div className="avatar">
                        <label htmlFor="input">
                          <img
                            src={ImageIcon}
                            alt="upload"
                            className="img-upload"
                          />
                          <p style={{ color: 'white', fontSize: 18 }}>
                            Click to upload image
                          </p>
                        </label>
                      </div>
                    )}
                    <input
                      type="file"
                      id="input"
                      accept="image/*"
                      onChange={selectImage}
                      onClick={(event) => {
                        event.target.value = null;
                      }}
                      style={{
                        display: 'none',
                        float: 'left',
                      }}
                    />
                    {pickedImage ? (
                      <div className="picked-avatar">
                        <img
                          className="picked-avatar-image"
                          src={pickedImage}
                          alt="picked"
                        />
                        <Button
                          type="link"
                          icon={<DeleteOutlined />}
                          onClick={() => setPickedImage(null)}
                          style={{ float: 'right' }}
                        >
                          Change image
                        </Button>
                      </div>
                    ) : null}
                    {!pickedImage ? (
                      <p style={{ color: 'red' }}>* Please upload image</p>
                    ) : null}
                  </div>
                </Form.Item>

                <Form.Item
                  label="First Name"
                  name="firstname"
                  rules={[
                    {
                      required: true,
                      message: 'Please input firstname!',
                    },
                  ]}
                >
                  <Input placeholder="Please input first name" />
                </Form.Item>
                <Form.Item
                  label="Last Name"
                  name="lastname"
                  rules={[
                    {
                      required: true,
                      message: 'Please input lastname!',
                    },
                  ]}
                >
                  <Input placeholder="Please input last name" />
                </Form.Item>
                <Form.Item
                  label="Date of Birth"
                  name="birth_day"
                  rules={[
                    {
                      required: true,
                      message: 'Please select date of birth!',
                    },
                  ]}
                >
                  <DatePicker
                    placeholder="Please select date"
                    style={{ width: 410, borderRadius: 20 }}
                  />
                </Form.Item>
                <Form.Item
                  label="Gender"
                  name="gender"
                  rules={[
                    {
                      required: true,
                      message: 'Please select gender!',
                    },
                  ]}
                >
                  <Select
                    placeholder="Please select gender"
                    style={{ borderRadius: 20 }}
                  >
                    <Select.Option key={'male'} value="Male">
                      Male
                    </Select.Option>
                    <Select.Option key={'female'} value="Female">
                      Female
                    </Select.Option>
                  </Select>
                </Form.Item>
              </div>
            </Col>
            <Col span={12}>
              <div className="md-form">
                <Form.Item
                  label="Nationality"
                  name="nationality"
                  rules={[
                    {
                      required: true,
                      message: 'Please select country!',
                    },
                  ]}
                >
                  <Select
                    placeholder="Type to search and select country"
                    showSearch
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {locale.map((country, idx) => (
                      <Option key={idx} value={country['ISO CODES']}>
                        {country['COUNTRY']}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item
                  label="ID Number"
                  name="id_number"
                  rules={[
                    {
                      required: true,
                      message: 'Please input ID Card number!',
                    },
                  ]}
                >
                  <Input placeholder="Please input id card" />
                </Form.Item>
                <Form.Item label="Passport Number" name="passport_number">
                  <Input placeholder="Please input passport number" />
                </Form.Item>
                {/*<Form.Item*/}
                {/*  label="Address"*/}
                {/*  name="address"*/}
                {/*  rules={[*/}
                {/*    {*/}
                {/*      required: true,*/}
                {/*      message: 'Please select address number!',*/}
                {/*    },*/}
                {/*  ]}*/}
                {/*>*/}
                {/*  <Select*/}
                {/*    showSearch*/}
                {/*    filterOption={(input, option) =>*/}
                {/*      option.children*/}
                {/*        .toLowerCase()*/}
                {/*        .indexOf(input.toLowerCase()) >= 0*/}
                {/*    }*/}
                {/*    placeholder="Please select address"*/}
                {/*  >*/}
                {/*    {addresses*/}
                {/*      ? addresses.map((address, idx) => (*/}
                {/*          <Option key={idx} value={address.id}>*/}
                {/*            {address.address_number}*/}
                {/*          </Option>*/}
                {/*        ))*/}
                {/*      : null}*/}
                {/*  </Select>*/}
                {/*</Form.Item>*/}
                <Form.Item
                  label="Resident Class"
                  rules={[
                    {
                      required: true,
                      message: 'Please select resident class!',
                    },
                  ]}
                  name="resident_class"
                >
                  <Select placeholder="Please select resident class">
                    <Select.Option key={'privilege'} value="Privilege">
                      Privilege
                    </Select.Option>
                    <Select.Option key={'general'} value="General">
                      General
                    </Select.Option>
                  </Select>
                </Form.Item>
                {/*<Form.Item*/}
                {/*  label="Resident Type"*/}
                {/*  name="resident_type"*/}
                {/*  rules={[*/}
                {/*    {*/}
                {/*      required: true,*/}
                {/*      message: 'Please select resident type!',*/}
                {/*    },*/}
                {/*  ]}*/}
                {/*>*/}
                {/*  <Select placeholder="Please select resident type">*/}
                {/*    <Select.Option key={'owner'} value="Owner">*/}
                {/*      Owner*/}
                {/*    </Select.Option>*/}
                {/*    <Select.Option key={'inhabitant'} value="Inhabitant">*/}
                {/*      Inhabitant*/}
                {/*    </Select.Option>*/}
                {/*    <Select.Option key={'tenant'} value="Tenant">*/}
                {/*      Tenant*/}
                {/*    </Select.Option>*/}
                {/*  </Select>*/}
                {/*</Form.Item>*/}
                <Form.Item
                  label="Telephone Number"
                  name="tel"
                  rules={[
                    {
                      required: true,
                      message: 'Please input phone number!',
                    },
                  ]}
                >
                  <Input placeholder="Please input phone number" />
                </Form.Item>
                <Form.Item
                  label="E-mail"
                  name="email"
                  rules={[
                    {
                      required: true,
                      message: 'Please input email!',
                    },
                    {
                      type: 'email',
                      message: 'The input is not valid E-mail!',
                    },
                  ]}
                >
                  <Input placeholder="Please input email" />
                </Form.Item>
                <Form.Item label="Vehicle Type" name="vehicle_type">
                  <Select placeholder="Please select vehicle type">
                    <Select.Option key={'car'} value="Car">
                      Car
                    </Select.Option>
                    <Select.Option key={'bike'} value="Bike">
                      Bike
                    </Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item label="License Plate" name="lp_number">
                  <Input placeholder="Please input license plate" />
                </Form.Item>
              </div>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
}

export default CreateModal;
