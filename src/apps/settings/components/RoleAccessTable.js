import React from 'react';
import { Table } from 'antd';

import { admin_access, juristic_access } from '../utils/user_role';
import { ReactComponent as AllowIcon } from '../assets/icons/allow.svg';
import { MinusOutlined } from '@ant-design/icons';

const RoleAccessTable = ({ role }) => {
  const column = [
    { title: 'Function', dataIndex: 'function_name', key: 'idx' },
    {
      title: 'Full Access',
      dataIndex: 'full_access',
      key: 'idx',
      render: (_, { full_access }) => (
        <div>{full_access ? <AllowIcon /> : <MinusOutlined />}</div>
      ),
    },
    {
      title: 'Create',
      dataIndex: 'create',
      key: 'idx',
      render: (_, { create }) => (
        <div>{create ? <AllowIcon /> : <MinusOutlined />}</div>
      ),
    },
    {
      title: 'Read',
      dataIndex: 'read',
      key: 'idx',
      render: (_, { read }) => (
        <div>{read ? <AllowIcon /> : <MinusOutlined />}</div>
      ),
    },
    {
      title: 'Update/Edit',
      dataIndex: 'update',
      key: 'idx',
      render: (_, { update }) => (
        <div>{update ? <AllowIcon /> : <MinusOutlined />}</div>
      ),
    },
    {
      title: 'Delete',
      dataIndex: 'remove',
      key: 'idx',
      render: (_, { remove }) => (
        <div>{remove ? <AllowIcon /> : <MinusOutlined />}</div>
      ),
    },
  ];
  return (
    <div>
      <Table
        dataSource={
          role.type === 'admin_project' ? admin_access : juristic_access
        }
        columns={column}
        pagination={false}
      />
    </div>
  );
};

export default RoleAccessTable;
