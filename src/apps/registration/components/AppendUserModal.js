import React, { useEffect, useState } from 'react';
import { Form, Button, Select, Modal } from 'antd';
import ResidentService from '../services/resident.service';

export default function AppendUserModal({ userRule, visible, onCancel, id }) {
  const [users, setUsers] = useState();
  const [form] = Form.useForm();
  useEffect(() => {
    (async () => {
      ResidentService.getAllUsers().then((users) => setUsers(users));
    })();
  }, []);
  return (
    <Modal
      centered
      title={'Add ' + userRule + ' user'}
      visible={visible}
      onCancel={() => onCancel()}
      footer={[
        <Button
          onClick={(e) => {
            e.preventDefault();
            form.validateFields().then((value) => {
              let newValue = {
                address: id,
                resident_role: userRule,
                ...value,
              };
              ResidentService.addUserToAddress(newValue).then(() => onCancel());
            });
          }}
        >
          Add
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
