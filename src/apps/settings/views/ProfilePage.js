import React, { useState, useEffect } from 'react';
import Header from '../../../components/Header';
import { Row, Col, Avatar, Button, Space, notification } from 'antd';
import axios from 'axios';
import { encryptStorage } from '../../../utils/encryptStorage';
import EditProfileModal from '../components/EditProfileModal';

import '../styles/profile.css';

import NoImage from '../../assets/images/noImg.jpg';

function ProfilePage() {
  // set static variables
  const session = encryptStorage.getItem('user_session');
  const header = {
    headers: {
      Authorization: 'Bearer ' + session.jwt,
    },
  };
  // variables
  const URL = process.env.REACT_APP_API_URL;
  const userWithIdURL = `/users/${session.user.id}`;
  const uploadURL = `/upload`;
  const [data, setData] = useState([]);
  const [visible, setVisible] = useState(false);

  const fetchData = async () => {
    await axios
      .get(`${URL}${userWithIdURL}`, header)
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        console.log('ERROR', err);
      });
  };

  const handleOnAdd = async (value, files) => {
    let dataImage = new FormData();
    let imageId = [];
    if (files) {
      dataImage.append('files', files[0]);
      await axios.post(`${URL}${uploadURL}`, dataImage, header).then((res) => {
        imageId = res.data[0];
      });
    }

    await axios
      .put(
        `${URL}${userWithIdURL}`,
        files
          ? {
              fullname: value.name,
              tel: value.tel,
              avatar: imageId,
            }
          : {
              fullname: value.name,
              tel: value.tel,
            },
        header
      )
      .then(() => {
        setVisible(false);
        notification['success']({
          duration: 2,
          message: 'Edit profile',
          description: 'Edit profile successfully.',
          style: { borderRadius: '25px' },
        });
        fetchData();
      })
      .catch((err) => {
        console.error("Can't edit data: ", err);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <Header title={'Profile'} />
      <div className="profileContainer">
        <Col align="middle">
          <Col span={12}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <Avatar
                src={
                  data?.avatar?.url
                    ? `${process.env.REACT_APP_API_URL}${data.avatar.url}`
                    : NoImage
                }
                size={200}
              />
            </div>
            <Button
              type="default"
              size="middle"
              shape="round"
              style={{ marginTop: 30, marginBottom: 60 }}
              onClick={() => {
                setVisible(true);
              }}
            >
              Edit Profile
            </Button>
          </Col>
          <Col span={12}>
            <Col>
              <Col span={20}>
                <Space style={{ width: '100%' }} direction="vertical" size={20}>
                  <Row justify="space-between">
                    <p style={{ fontWeight: 'bolder' }}>Name :</p>
                    <p>{data?.fullname ? data.fullname : '-'}</p>
                  </Row>
                  <Row justify="space-between">
                    <p style={{ fontWeight: 'bolder' }}>E-mail :</p>
                    <p>{data?.email ? data.email : '-'}</p>
                  </Row>
                  <Row justify="space-between">
                    <p style={{ fontWeight: 'bolder' }}>Tel :</p>
                    <p>{data?.tel ? data.tel : '-'}</p>
                  </Row>
                  <Row justify="space-between">
                    <p style={{ fontWeight: 'bolder' }}>Role :</p>
                    <p>{data?.role?.name ? data.role.name : '-'}</p>
                  </Row>
                </Space>
              </Col>
            </Col>
          </Col>
        </Col>
      </div>
      <EditProfileModal
        visible={visible}
        data={data}
        onAdd={handleOnAdd}
        onCancel={() => {
          setVisible(false);
        }}
      />
    </>
  );
}

export default ProfilePage;
