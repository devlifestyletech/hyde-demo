import React from 'react';
import { Table, Row, Image } from 'antd';
import '../styles/user_table.css';

function UserTable({ users, loading, key }) {
  const columns = [
    {
      title: 'Full Name',
      dataIndex: 'fullname',
      key: 'idx',
      render: (_, { firstname, lastname, avatar, idx }) => (
        <div key={idx}>
          <Row>
            <Image
              src={process.env.REACT_APP_API_URL + avatar?.url}
              width={50}
              height={50}
              style={{ borderRadius: 25 }}
              fallback={
                'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png'
              }
            />
            <div className="fullname">{firstname + ' ' + lastname}</div>
          </Row>
        </div>
      ),
    },
    {
      title: 'role',
      dataIndex: 'role',
      key: 'idx',
      render: (_, { role, idx }) => <div key={idx}>{role.name}</div>,
    },
  ];

  return <Table key={key} dataSource={users} columns={columns} loading={loading} />;
}

export default UserTable;
