import React, { useState } from 'react';
import { Row, Col, Empty, Dropdown, Menu, Divider, Modal } from 'antd';
import {
  EllipsisOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import residentService from '../services/residentServices';
import ChangeUserModal from './ChangeUserModal';

function UsersInfo({ user, onEvent, isOwner = false }) {
  // console.log(user);
  const [appendUserModalVisibility, setAppendUserModalVisibility] =
    useState(false);

  function showConfirm(id) {
    Modal.confirm({
      title: 'Do you Want to delete these resident?',
      icon: <ExclamationCircleOutlined />,
      content: 'The resident will remove from this address',
      onOk() {
        residentService
          .removeUserFromAddress(id, user.users_permissions_user.id)
          .then(() => onEvent());
      },
      onCancel() {
        onEvent();
      },
    });
  }

  return (
    <>
      <ChangeUserModal
        visible={appendUserModalVisibility}
        id={user.id}
        userRule={user.resident_role}
        userId={user.users_permissions_user.id}
        addressId={user.address.id}
        onCancel={() => {
          setAppendUserModalVisibility(false);
          onEvent();
        }}
      />
      <Dropdown
        overlay={
          <Menu
            onClick={(e) => {
              if (e.key === 'edit') {
                setAppendUserModalVisibility(true);
              }
              if (e.key === 'delete') {
                showConfirm(user.id);
              }
            }}
          >
            <Menu.Item key="edit" icon={<EditOutlined />}>
              Change user
            </Menu.Item>
            {isOwner ? null : (
              <Menu.Item key="delete" danger icon={<DeleteOutlined />}>
                Delete user
              </Menu.Item>
            )}
          </Menu>
        }
      >
        <EllipsisOutlined style={{ float: 'right', fontSize: 20 }} />
      </Dropdown>
      <br />
      <Row>
        <Col span="10">
          {user.users_permissions_user.image ? (
            <div style={{ textAlign: 'center', margin: 20 }}>
              <img
                src={
                  process.env.REACT_APP_API_URL +
                  user.users_permissions_user.image.url
                }
                alt="avatar"
                style={{
                  borderRadius: 20,
                  maxHeight: 250,
                  maxWidth: '100%',
                }}
              />
            </div>
          ) : (
            <div>
              <Empty />
            </div>
          )}
        </Col>
        <Col span="14">
          <Row style={{ marginBottom: 10 }}>
            <Col span="12">
              <div>
                <strong>Firstname</strong>
                <br />
                {user ? user.users_permissions_user.firstname ?? '-' : null}
              </div>
            </Col>
            <Col span="12">
              <div>
                <strong>Lastname</strong>
                <br />
                {user.users_permissions_user.lastname ?? '-'}
              </div>
            </Col>
          </Row>
          <Row style={{ marginBottom: 10 }}>
            <Col span="12">
              <div>
                <strong>Email address</strong>
                <br />
                {user.users_permissions_user.email ?? '-'}
              </div>
            </Col>
            <Col span="12">
              <div>
                <strong>Telephone number</strong>
                <br />
                {user.users_permissions_user.tel ?? '-'}
              </div>
            </Col>
          </Row>
          <Row style={{ marginBottom: 10 }}>
            <Col span="12">
              <div>
                <strong>Gender</strong>
                <br />
                {user.users_permissions_user.gender ?? '-'}
              </div>
            </Col>
            <Col span="12">
              <div>
                <strong>Nationality</strong>
                <br />
                {user.users_permissions_user.nationality ?? '-'}
              </div>
            </Col>
          </Row>
          <Row style={{ marginBottom: 10 }}>
            <Col span="12">
              <div>
                <strong>ID Card number</strong>
                <br />
                {user.users_permissions_user.id_number ?? '-'}
              </div>
            </Col>
            <Col span="12">
              <div>
                <strong>License plate number</strong>
                <br />
                {user.users_permissions_user.lp_number ?? '-'}
              </div>
            </Col>
          </Row>
          <Row style={{ marginBottom: 10 }}>
            <Col span="12">
              <div>
                <strong>Birth day</strong>
                <br />
                {user.users_permissions_user.birth_day ?? '-'}
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
      <Divider />
    </>
  );
}

export default UsersInfo;
