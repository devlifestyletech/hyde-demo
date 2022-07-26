import { Button, Form, Input, Modal, Row } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';
import EmailIcon from './assets/email.svg';
import authService from '../services/authServices';

function ForgotPasswordPage() {
  const [ForgotPasswordForm] = Form.useForm();

  async function onFinish(value) {
    try {
      const { data } = await authService.forgotPassword(value);
      if (data) {
        return Modal.success({
          title: 'Success !',
          content: 'Please check your email to reset your password',
          onOk: () => {
            ForgotPasswordForm.resetFields();
            window.location.href = '/signin';
          },
        });
      }
    } catch (error) {
      return Modal.error({
        title: 'Error !',
        content:
          "Email doesn't exist, please try again or contact your administrator",
        onOk: () => {
          ForgotPasswordForm.resetFields();
        },
      });
    }
  }

  function onFinishFailed(error) {
    console.debug(error);
  }

  return (
    <div className="login-form">
      <div style={{ textAlign: 'left', color: 'white', marginBottom: 50 }}>
        <h1 style={{ color: 'white' }}>Forget Your Password?</h1>
        <p>Enter your e-mail to receive further guidance</p>
      </div>
      <Form
        layout="vertical"
        style={{ color: 'white' }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        form={ForgotPasswordForm}
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[
            {
              type: 'email',
              message: 'The input is not valid E-mail!',
            },
            {
              required: true,
              message: 'Please input your E-mail!',
            },
          ]}
        >
          <Input prefix={<img src={EmailIcon} alt="email" />} />
        </Form.Item>
        <Form.Item>
          <Row style={{ justifyContent: 'space-around' }}>
            <Link to="/">
              <Button
                style={{
                  width: 200,
                  backgroundColor: 'rgba(32, 38, 58, 1)',
                  borderColor: 'white',
                }}
              >
                Cancel
              </Button>
            </Link>
            <Button style={{ width: 200 }} htmlType="submit">
              Send
            </Button>
          </Row>
        </Form.Item>
      </Form>
    </div>
  );
}

export default ForgotPasswordPage;
