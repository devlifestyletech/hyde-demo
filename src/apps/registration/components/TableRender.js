import React, { useState, useEffect } from 'react';
import { Button, Divider, Table, Modal, message } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

//image import from
import editIcon from '../assets/icons/edit.svg';
import trashIcon from '../assets/icons/trash.svg';
import EditModal from './EditModal';
import authService from '../../../services/authServices';

export default function TableRender({ data, key, onEvent, loading }) {
  const [user, setUser] = useState(null);
  const [EditModalVisibility, setEditModalVisibility] = useState(false);
  const [handleId, setHandleId] = useState(null);

  useEffect(() => {
    (async () => {
      const { data } = await authService.getUserData(handleId);
      if (data) {
        setUser(data);
      }
    })();
  }, [handleId]);

  const handleClickEdit = (id) => {
    setHandleId(id);
    setEditModalVisibility(true);
  };

  function handleClickDelete(id) {
    return Modal.confirm({
      autoFocusButton: null,
      maskStyle: {
        borderRadius: 20,
      },
      title: 'Do you Want to delete this user?',
      icon: <ExclamationCircleOutlined />,
      content: 'This user has been deleted from the database',
      okText: 'Confirm',
      okButtonProps: { shape: 'round', type: 'danger' },
      cancelButtonProps: { shape: 'round' },
      async onOk() {
        const deleted = await authService.deleteUser(id);
        if (deleted) {
          message.success('Delete success!');
          onEvent();
        }
      },
      onCancel() {
        return null;
      },
    });
  }

  const columns = [
    {
      title: 'No.',
      dataIndex: 'number',
      key: 'idx',
    },
    {
      title: 'Full Name',
      dataIndex: 'fullname',
      key: 'idx',
      render: (fullname, idx) => (
        <div key={idx}>{fullname ? fullname : null}</div>
      ),
    },
    {
      title: 'Nationality',
      dataIndex: 'nationality',
      key: 'idx',
    },
    {
      title: 'Tel',
      dataIndex: 'tel',
      key: 'idx',
    },
    {
      title: 'E-mail',
      dataIndex: 'email',
      key: 'idx',
    },
    {
      title: 'Action',
      dataIndex: 'id',
      key: 'idx',
      render: (id, idx) => (
        <div style={{ borderRadius: 20 }} key={idx}>
          <Button
            type="link"
            onClick={() => handleClickEdit(id)}
            icon={<img src={editIcon} alt="Edit" />}
          />
          <Divider type="vertical" style={{ height: 30 }} />
          <Button
            type="link"
            onClick={() => handleClickDelete(id)}
            icon={<img src={trashIcon} alt="Delete" />}
          />
        </div>
      ),
    },
  ];

  return (
    <React.Fragment key={key}>
      <Table
        dataSource={data}
        columns={columns}
        loading={loading}
        pagination={{
          pageSize: 50,
        }}
      />
      <EditModal
        visible={EditModalVisibility}
        onCancel={() => {
          setUser(null);
          setEditModalVisibility(false);
          onEvent();
        }}
        user={user}
      />
    </React.Fragment>
  );
}
