import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Form, Input, Modal } from 'antd';
import './styles/signin.css';

import UserIcon from '../apps/assets/icons/user.svg';
import PasswordIcon from '../apps/assets/icons/password.svg';
import authService from '../services/auth.service';

import { encryptStorage } from '../utils/encryptStorage';
import { useAuth } from '../hooks/useAuth';

function Signin() {
  const [LoginForm] = Form.useForm();
  const { signin } = useAuth();

  const onFinish = async (value) => {
    try {
      const { data } = await authService.signIn(value);
      if (data.user.role.type !== 'resident') {
        try {
          await encryptStorage.setItem('user_session', JSON.stringify(data));
          await signin();
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
  const onFinishFailed = (error) => {
    console.debug(error);
  };

  return (
    <div className="login-form">
      <Form
        layout="vertical"
        style={{ color: 'white' }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        form={LoginForm}
      >
        <Form.Item
          label="Username"
          name="identifier"
          rules={[
            {
              required: true,
              message: 'Please input your username!',
            },
          ]}
        >
          <Input prefix={<img src={UserIcon} alt="user" />} />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[
            {
              required: true,
              message: 'Please input your password!',
            },
          ]}
        >
          <Input.Password prefix={<img src={PasswordIcon} alt="password" />} />
        </Form.Item>
        <div style={{ float: 'right' }}>
          <Link to="/forgot-password">
            <p style={{ color: 'white' }}>Forget Password?</p>
          </Link>
        </div>
        <Form.Item>
          <Button htmlType="submit">Login</Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default Signin;
