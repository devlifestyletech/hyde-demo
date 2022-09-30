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

function UsersInfo({ user, userRule, onEvent }) {
  // console.log(user);
  const [changeUserModalVisibility, setChangeUserModalVisibility] =
    useState(false);

  function showConfirm(id) {
    Modal.confirm({
      title: 'Do you Want to delete these resident?',
      icon: <ExclamationCircleOutlined />,
      content: 'The resident will remove from this address',
      onOk() {
        residentService
          .removeUserFromAddress(id, user.id)
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
        visible={changeUserModalVisibility}
        userRule={userRule}
        userId={user.id}
        addressId={user.address}
        onCancel={() => {
          setChangeUserModalVisibility(false);
        }}
        refresh={onEvent}
      />
      <Dropdown
        overlay={
          <Menu
            onClick={(e) => {
              if (e.key === 'edit') {
                setChangeUserModalVisibility(true);
              }
              if (e.key === 'delete') {
                showConfirm(user.id);
              }
            }}
          >
            <Menu.Item key="edit" icon={<EditOutlined />}>
              Change user
            </Menu.Item>

            <Menu.Item key="delete" danger icon={<DeleteOutlined />}>
              Delete user
            </Menu.Item>
          </Menu>
        }
      >
        <EllipsisOutlined style={{ float: 'right', fontSize: 20 }} />
      </Dropdown>
      <br />
      <Row>
        <Col span="10">
          {user.image ? (
            <div style={{ textAlign: 'center', margin: 20 }}>
              <img
                src={process.env.REACT_APP_API_URL + user.image.url}
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
                {user ? user.firstname ?? '-' : null}
              </div>
            </Col>
            <Col span="12">
              <div>
                <strong>Lastname</strong>
                <br />
                {user.lastname ?? '-'}
              </div>
            </Col>
          </Row>
          <Row style={{ marginBottom: 10 }}>
            <Col span="12">
              <div>
                <strong>Email address</strong>
                <br />
                {user.email ?? '-'}
              </div>
            </Col>
            <Col span="12">
              <div>
                <strong>Telephone number</strong>
                <br />
                {user.tel ?? '-'}
              </div>
            </Col>
          </Row>
          <Row style={{ marginBottom: 10 }}>
            <Col span="12">
              <div>
                <strong>Gender</strong>
                <br />
                {user.gender ?? '-'}
              </div>
            </Col>
            <Col span="12">
              <div>
                <strong>Nationality</strong>
                <br />
                {user.nationality ?? '-'}
              </div>
            </Col>
          </Row>
          <Row style={{ marginBottom: 10 }}>
            <Col span="12">
              <div>
                <strong>ID Card number</strong>
                <br />
                {user.id_number ?? '-'}
              </div>
            </Col>
            <Col span="12">
              <div>
                <strong>License plate number</strong>
                <br />
                {user.lp_number ?? '-'}
              </div>
            </Col>
          </Row>
          <Row style={{ marginBottom: 10 }}>
            <Col span="12">
              <div>
                <strong>Birth day</strong>
                <br />
                {user.birth_day ?? '-'}
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
