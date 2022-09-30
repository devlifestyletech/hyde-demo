import {Button, Form, Input, Modal} from 'antd';
import React from 'react';
import {Link} from 'react-router-dom';
import PasswordIcon from '../apps/assets/icons/password.svg';

import UserIcon from '../apps/assets/icons/user.svg';
import {useAuth} from '../hooks/useAuth';
import authService from '../services/authServices';

import {encryptStorage} from '../utils/encryptStorage';
import {fcmWeb} from '../utils/firebaseConfig';
import './styles/signin.css';

function SigninPage() {
  const [LoginForm] = Form.useForm();
  const {signin} = useAuth();

  const onFinish = async (value) => {
    try {
      const {data} = await authService.signIn(value);
      if (data.user.role.type !== 'resident') {
        try {
          await encryptStorage.setItem('user_session', JSON.stringify(data));
          await signin();
          await fcmTokenDashboard(data.user.id);
        } catch (e) {
          console.error(e.message);
        }
      } else {
        Modal.error({
          title: 'Error !',
          content: 'This web application available for juristic account only.',
          onOk: () => {
            LoginForm.resetFields();
          },
        });
      }
    } catch (error) {
      Modal.error({
        title: 'Error !',
        content: 'Username or password is incorrect',
        onOk: () => {
          LoginForm.resetFields();
        },
      });
    }
  };
  const fcmTokenDashboard = async (userId) => {
    const payload = {
      token: null,
      userId: null,
    };
    if (userId !== undefined) {
      payload.userId = userId;
    }
    const dataFCMWeb = await fcmWeb();
    if (dataFCMWeb.status) {
      payload.token = dataFCMWeb.fcm_token;
    }

    if (payload.token && payload.userId) {
      const {status} = await authService.registrationFCMToken(payload);
      console.log('status', status);
      if (status === 201) {
        payload.topic = 'Admins';
        await authService.subscribeFCMToken(payload);
        await encryptStorage.setItem('fcm_token', payload);
      }
    }
  };
  const onFinishFailed = (error) => {
    console.debug(error);
  };

  return (
      <div className='login-form'>
        <Form
            layout='vertical'
            style={{color: 'white'}}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete='off'
            form={LoginForm}
        >
          <Form.Item
              label='Username'
              name='identifier'
              rules={[
                {
                  required: true,
                  message: 'Please input your username!',
                },
              ]}
          >
            <Input prefix={<img src={UserIcon} alt='user' />} />
          </Form.Item>
          <Form.Item
              label='Password'
              name='password'
              rules={[
                {
                  required: true,
                  message: 'Please input your password!',
                },
              ]}
          >
            <Input.Password
                prefix={<img src={PasswordIcon} alt='password' />} />
          </Form.Item>
          <div style={{float: 'right'}}>
            <Link to='/forgot-password'>
              <p style={{color: 'white'}}>Forget Password?</p>
            </Link>
          </div>
          <Form.Item>
            <Button htmlType='submit'>Login</Button>
          </Form.Item>
        </Form>
      </div>
  );
}

export default SigninPage;
