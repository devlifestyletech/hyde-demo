import {Button, Col, Form, Image, Input, Modal} from 'antd';
import axios from 'axios';
import React, {useState} from 'react';
import Header from '../../../components/Header';
import {encryptStorage} from '../../../utils/encryptStorage';
import LockImage from '../assets/images/change_password.png';

import '../styles/profile.css';

function ChangePasswordPage() {
  // set static variables
  const session = encryptStorage.getItem('user_session');
  const header = {
    headers: {
      Authorization: 'Bearer ' + session.jwt,
    },
  };
  const URL = process.env.REACT_APP_API_URL;
  const authURL = '/auth/local';
  const changePassURL = `/users/${session.user.id}`;
  // set variables
  const [form] = Form.useForm();
  const [disable, setDisable] = useState(false);

  const onFinish = async (values) => {
    let value = {
      identifier: session.user.username,
      password: values.password,
    };
    console.log(value);
    setDisable(true);

    if (values.new_password === values.confirm_new_password) {
      await axios.post(`${URL}${authURL}`, value).then(() => {
        setDisable(false);
        axios.put(
            `${URL}${changePassURL}`,
            {
              password: values.new_password,
            },
            header,
        ).then(() => {
          form.setFieldsValue({
            password: null,
            new_password: null,
            confirm_new_password: null,
          });
          Modal.success({
            content: 'Change password success',
          });
        }).catch((err) => {
          console.log(err);
        });
      }).catch(() => {
        setDisable(false);
        Modal.error({
          title: 'Error !',
          content: 'Your password is invalid, Please try again',
        });
      });
    } else {
      setDisable(false);
      Modal.error({
        title: 'Error !',
        content: 'Please confirm your new password again.',
      });
    }
  };

  return (
      <>
        <Header title='Change Password' />
        <div className='profileContainer'>
          <Col align='middle'>
            <Col span={12}>
              <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                  }}
              >
                <Image preview={false} src={LockImage} />
              </div>
            </Col>
            <Col className='spaceTopChangePass' span={12}>
              <Form
                  form={form}
                  name='basic'
                  onFinish={onFinish}
                  autoComplete='off'
                  layout='vertical'
              >
                <Col span={24}>
                  <Col span={24}>
                    <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                        }}
                    >
                      <Form.Item
                          label='Confirm Your Existing Password'
                          name='password'
                          rules={[
                            {
                              required: true,
                              message: 'Please input your password!',
                            },
                          ]}
                      >
                        <Input.Password />
                      </Form.Item>
                      <Form.Item
                          label='New Password'
                          name='new_password'
                          rules={[
                            {
                              required: true,
                              message: 'Please input your new password!',
                            },
                          ]}
                      >
                        <Input.Password />
                      </Form.Item>
                      <Form.Item
                          label='Confirm New Password'
                          name='confirm_new_password'
                          rules={[
                            {
                              required: true,
                              message: 'Please confirm your new password!',
                            },
                          ]}
                      >
                        <Input.Password />
                      </Form.Item>
                    </div>
                  </Col>
                  <Form.Item>
                    <Button
                        type='primary'
                        size='large'
                        shape='round'
                        htmlType='submit'
                        disabled={disable}
                        className='changePassBtn'
                    >
                      Save
                    </Button>
                  </Form.Item>
                </Col>
              </Form>
            </Col>
          </Col>
        </div>
      </>
  );
}

export default ChangePasswordPage;
