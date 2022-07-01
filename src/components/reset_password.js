import React from 'react';
import { useSearchParams } from 'react-router-dom';
import authService from '../services/auth.service';
import { Button, Form, Input, Modal } from 'antd';
import './styles/main.css';

export default function ResetPasswordPage() {
  const [resetPasswordForm] = Form.useForm();
  const [searchParams] = useSearchParams();
  let code = searchParams.get('code');

  async function onFinish(value) {
    authService
      .resetPassword({
        code: code,
        ...value,
      })
      .then(() =>
        Modal.success({
          title: 'Success !',
          content: 'Please signin in with your new password',
          onOk: () => {
            window.open('about:blank', '_self');
            window.close();
          },
        })
      )
      .catch(() =>
        Modal.error({
          title: 'Error !',
          content: 'Some things went wrong, please try again later',
          onOk: () => {
            window.open('about:blank', '_self');
            window.close();
          },
        })
      );
  }

  return (
    <div className="main_box">
      <div style={{ textAlign: 'left', marginBottom: 50 }}>
        <h1 style={{ color: 'white' }}>Forget Your Password?</h1>
        <h2 style={{ color: 'white' }}>
          Enter a new password below to change your password
        </h2>
      </div>
      <Form
        form={resetPasswordForm}
        name="register"
        onFinish={onFinish}
        layout="vertical"
      >
        <Form.Item
          name="password"
          label="Password"
          rules={[
            {
              required: true,
              message: 'Please input your password!',
            },
            {
              pattern: /^(?!.*\s)(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/,
              message:
                'Password must 6 to 20 characters which contain at least must not contain whitespaces, one numeric digit, one uppercase and one lowercase letter',
            },
          ]}
          hasFeedback
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          name="passwordConfirmation"
          label="Confirm Password"
          dependencies={['password']}
          hasFeedback
          rules={[
            {
              required: true,
              message: 'Please confirm your password!',
            },
            {
              pattern: /^(?!.*\s)(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/,
              message:
                'Password must 6 to 20 characters which contain at least must not contain whitespaces, one numeric digit, one uppercase and one lowercase letter',
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error('The two passwords that you entered do not match!')
                );
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            style={{ marginTop: 50 }}
          >
            Reset Password
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
