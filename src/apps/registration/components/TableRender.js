import React, { useState, useEffect } from 'react';
import { Button, Divider, Table, Modal, message } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

//image import from
import editIcon from '../assets/icons/edit.svg';
import trashIcon from '../assets/icons/trash.svg';
import EditModal from './EditModal';
import authService from '../../../services/auth.service';

export default function TableRender({ data, key, onEvent }) {
  const [user, setUser] = useState();
  const [EditModalVisibility, setEditModalVisibility] = useState(false);
  const [handleId, setHandleId] = useState(null);

  useEffect(() => {
    (async () => {
      authService.getUserData(handleId).then((res) => {
        setUser(res.data);
      });
    })();
  }, [handleId]);

  const handleClickEdit = (id) => {
    setHandleId(id);
    setEditModalVisibility(true);
  };

  function handleClickDelete(id) {
    Modal.confirm({
      maskStyle: {
        borderRadius: 20,
      },
      title: 'Do you Want to delete this user?',
      icon: <ExclamationCircleOutlined />,
      content: 'This user has been deleted from the database',
      okType: 'danger',
      okText: 'Confirm',
      okButtonProps: { shape: 'round' },
      cancelButtonProps: { shape: 'round' },
      onOk() {
        authService.deleteUser(id).then((res) => {
          message.success('Delete success!');
          onEvent();
        });
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
      title: 'Address',
      dataIndex: 'address',
      key: 'idx',
      render: (address, idx) => <div key={idx}>{address.address_number}</div>,
    },
    {
      title: 'Owner',
      dataIndex: 'fullname',
      key: 'idx',
    },
    {
      title: 'Nationality',
      dataIndex: 'nationality',
      key: 'idx',
    },
    {
      title: 'Type',
      dataIndex: 'project',
      key: 'idx',
      render: (project, idx) => (
        <div key={idx}>{project ? project.project_type : null}</div>
      ),
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
      <Table dataSource={data} columns={columns} />
      <EditModal
        visible={EditModalVisibility}
        onCancel={() => {
          setEditModalVisibility(false);
          setUser();
        }}
        user={user}
      />
    </React.Fragment>
  );
}
