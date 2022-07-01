import React, { useEffect, useState } from 'react';
import { Form, Button, Select, Modal } from 'antd';
import ResidentService from '../services/resident.service';
import { ExclamationCircleOutlined } from '@ant-design/icons';

export default function ChangeUserModal({ userRule, visible, onCancel, id }) {
  const [users, setUsers] = useState();
  const [form] = Form.useForm();
  useEffect(() => {
    (async () => {
      ResidentService.getAllUsers().then((users) => setUsers(users));
    })();
  }, []);

  function showConfirm(value) {
    Modal.confirm({
      title: 'Do you Want to change resident role?',
      icon: <ExclamationCircleOutlined />,
      content: 'This role will change user',
      onOk() {
        ResidentService.changeRoleUser(value, id).then((res) => onCancel());
      },
      onCancel() {},
    });
  }
  return (
    <Modal
      centered
      title={'Change ' + userRule + ' resident'}
      visible={visible}
      onCancel={() => onCancel()}
      footer={[
        <Button
          onClick={(e) => {
            e.preventDefault();
            form.validateFields().then((value) => {
              showConfirm(value);
            });
          }}
        >
          Save Change
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="users_permissions_user" label="Select user from list">
          <Select
            showSearch
            placeholder="Search to Select"
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            filterSort={(optionA, optionB) =>
              optionA.children
                .toLowerCase()
                .localeCompare(optionB.children.toLowerCase())
            }
          >
            {users
              ? users.map((user, index) => (
                  <Select.Option key={index} value={user.id}>
                    {user.firstname + ' ' + user.lastname}
                  </Select.Option>
                ))
              : null}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
}
