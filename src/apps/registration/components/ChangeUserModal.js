import React, { useEffect, useState } from 'react';
import { Form, Button, Select, Modal } from 'antd';
import ResidentService from '../services/residentServices';
import { ExclamationCircleOutlined } from '@ant-design/icons';

export default function ChangeUserModal({
  userRule,
  visible,
  onCancel,
  id,
  userId,
  addressId,
}) {
  const [users, setUsers] = useState([]);
  const [form] = Form.useForm();
  useEffect(() => {
    (async () => {
      const users = await ResidentService.getAllUsers();
      if (users) {
        setUsers(users);
      }
    })();
  }, []);

  function showConfirm(value) {
    return Modal.confirm({
      title: 'Do you Want to change resident role?',
      icon: <ExclamationCircleOutlined />,
      content: 'This role will change user',
      async onOk() {
        let newValue = {
          address: addressId,
          resident_role: userRule,
          ...value,
        };
        const removing = await ResidentService.changeRoleUser(value, id);
        if (removing) {
          const adding = await ResidentService.addUserToAddress(newValue);
          if (adding) onCancel();
        }
      },
      onCancel() {
        return null;
      },
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
          onClick={async (e) => {
            e.preventDefault();
            const value = await form.validateFields();
            if (value) {
              showConfirm(value);
            }
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
            {users.map((user, idx) => (
              <Select.Option key={idx} value={user.id}>
                {user.firstname + ' ' + user.lastname}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
}
