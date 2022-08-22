import React, { useState } from 'react';
import { Table, Row, Image, Button, Switch, Modal, message } from 'antd';
import './style/user_table.css';
import { ReactComponent as InfoIcon } from '../../assets/icons/admin_information.svg';
import { ReactComponent as TrashIcon } from '../../assets/icons/admin_trash.svg';
import { ReactComponent as DividerIcon } from '../../assets/icons/admin_divider.svg';
import ModalAccessInfo from './ModalAccessInfo';
import authService from '../../../services/authServices';

function UserTable({ data, loading, tableKey, onRefresh }) {
  const [modalAccessInfoVisible, setModalAccessInfoVisible] = useState(false);
  const [role, setRole] = useState(null);
  const [isSwitchLoad, setIsSwitchLoad] = useState(false);

  const handleAccess = () => {
    setModalAccessInfoVisible(!modalAccessInfoVisible);
  };

  const handleDisableAccount = async (id, role, val) => {
    const { type } = role;
    if (type === 'admin_project') {
      Modal.error({
        title: 'Something went wrong!',
        content: 'Project admin account can not be disabled.',
        okButtonProps: { shape: 'round', size: 'large', type: 'primary' },
        autoFocusButton: null,
      });
    } else {
      return Modal.confirm({
        title: 'This account will be disabled',
        content: 'Are you sure you want to disable this account?',
        async onOk() {
          try {
            setIsSwitchLoad(true);
            await authService
              .editUserData(id, {
                blocked: !val,
              })
              .then(() => {
                setIsSwitchLoad(false);
                onRefresh();
              });
          } catch (e) {
            console.error(e);
          }
        },
      });
    }
  };

  const handleDeleteAccount = async (id, role) => {
    const { type } = role;
    if (type === 'admin_project') {
      return Modal.error({
        title: 'Something went wrong!',
        content: 'Project admin account can not be delete.',
      });
    } else {
      return Modal.confirm({
        title: 'Are you sure you want to delete?',
        async onOk() {
          return new Promise(async (resolve, reject) => {
            try {
              const { data } = await authService.deleteUser(id);
              if (data) {
                console.log(data);
                message.success('Delete account successfully.');
                resolve('Success');
                onRefresh();
              }
              if (data?.image?.id) {
                await authService.deleteImage(data.image.id);
              }
              if (data?.avatar?.id) {
                await authService.deleteImage(data.avatar.id);
              }
            } catch (error) {
              reject(new Error(error));
            }
          }).catch(() => console.log('Oops errors!'));
        },
        onCancel() {},
        okButtonProps: { shape: 'round', type: 'danger', size: 'large' },
        cancelButtonProps: { shape: 'round', size: 'large' },
        autoFocusButton: null,
      });
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'fullname',
      key: 'idx',
      render: (_, { firstname, lastname, image, idx }) => (
        <div key={idx}>
          <Row>
            <Image
              src={`${process.env.REACT_APP_API_URL}${image?.url}`}
              width={50}
              height={50}
              style={{ borderRadius: 25 }}
              fallback={
                'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png'
              }
            />
            <div className="full_name">{firstname + ' ' + lastname}</div>
          </Row>
        </div>
      ),
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'idx',
      render: (_, { role, idx }) => <div key={idx}>{role.name}</div>,
    },
    {
      title: 'Tel',
      dataIndex: 'tel',
      key: 'idx',
    },
    {
      title: 'Action',
      dataIndex: 'id',
      key: 'idx',
      render: (_, { id, idx, role }) => (
        <div key={idx} className={'action_box'}>
          <Row>
            <Button
              type={'link'}
              onClick={() => {
                setRole(role);
                handleAccess(role);
              }}
            >
              <InfoIcon />
            </Button>
            <div style={{ marginTop: 5 }}>
              <DividerIcon />
            </div>
            <Button type={'link'} onClick={() => handleDeleteAccount(id, role)}>
              <TrashIcon />
            </Button>
          </Row>
        </div>
      ),
    },
    {
      title: 'Active',
      dataIndex: 'blocked',
      key: 'idx',
      render: (_, { blocked, idx, role, id }) => (
        <Switch
          key={idx}
          checked={!blocked}
          loading={isSwitchLoad}
          onClick={(val) => handleDisableAccount(id, role, val)}
        />
      ),
    },
  ];

  return (
    <>
      <Table
        key={tableKey}
        dataSource={data}
        columns={columns}
        loading={loading}
      />
      <ModalAccessInfo
        role={role}
        visible={modalAccessInfoVisible}
        cancelHandler={() => setModalAccessInfoVisible(!modalAccessInfoVisible)}
      />
    </>
  );
}

export default UserTable;
