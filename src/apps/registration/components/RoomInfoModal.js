import React, { useState } from 'react';
import { Empty, Button, Modal, Tabs } from 'antd';
import axios from 'axios';
import { encryptStorage } from '../../../utils/encryptStorage';
// import ProjectService from "../services/project.service";

//components
import AppendUserModal from './AppendUserModal';
import { PlusCircleOutlined } from '@ant-design/icons';
import UsersInfo from './UserInfo';
import imgIcon from '../../facility_management/assets/img.svg';
import { DeleteOutlined } from '@ant-design/icons';

const session = encryptStorage.getItem('user_session');
const { TabPane } = Tabs;

export const RoomInfoModal = ({
  visible,
  onCancel,
  id,
  owner,
  inhabitant,
  tenant,
  refresh,
  qrCode,
  addressId,
}) => {
  const header = {
    headers: {
      Authorization: 'Bearer ' + session.jwt,
    },
  };
  const [userRule, setUserRule] = useState(null);
  const [appendUserModalVisibility, setAppendUserModalVisibility] =
    useState(false);

  //image variable
  const [imageFile, setImageFile] = useState(null);
  const [img, setImg] = useState(true);
  const [pickedImage, setPickedImage] = useState(null);
  const [enable, setEnable] = useState(true);

  //functions
  const selectHandle = (e) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setPickedImage(reader.result);
      }
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  const handleQrCode = async (files, id) => {
    // filse => image file
    // id => address id
    setEnable(true);
    let dataImage = new FormData();
    let imageId = [];
    if (files) {
      dataImage.append('files', files[0]);
      await axios
        .post(process.env.REACT_APP_API_URL + '/upload/', dataImage, header)
        .then((res) => {
          imageId = res.data[0];
          axios
            .put(
              `${process.env.REACT_APP_API_URL}/addresses/${id}`,
              {
                qr_parking: imageId,
              },
              header
            )
            .then(() => {
              alert('Change image success!');
              onCancel();
              refresh();
              setEnable(false);
            })
            .catch((err) => {
              console.error("Can't edit data: ", err);
              setEnable(false);
            });
        })
        .catch((err) => {
          console.log('Err', err);
          setEnable(false);
        });
    } else {
      console.log('No file coming');
      setEnable(false);
    }
  };

  return (
    <>
      <Modal
        visible={visible}
        title="Information"
        onCancel={() => onCancel()}
        // footer={[<Button onClick={() => onCancel()}>Close</Button>]}
        footer={null}
        width={800}
        centered
      >
        <div>
          <Tabs defaultActiveKey="owner">
            <TabPane tab="Owner" key="owner">
              {owner.length ? (
                owner.map((owner, index) => (
                  <div key={'owner' + index}>
                    <UsersInfo user={owner} onEvent={() => refresh()} />
                  </div>
                ))
              ) : (
                <div style={{ textAlign: 'center' }}>
                  <Empty />
                  <Button
                    shape="round"
                    icon={<PlusCircleOutlined />}
                    onClick={() => {
                      setUserRule('Owner');
                      setAppendUserModalVisibility(!appendUserModalVisibility);
                    }}
                  >
                    Add owner user
                  </Button>
                </div>
              )}
            </TabPane>
            <TabPane tab="Inhabitant" key="inhabitant">
              {inhabitant.length ? (
                inhabitant.map((inhabitant, index) => (
                  <div key={'inhabitant' + index}>
                    <UsersInfo user={inhabitant} onEvent={() => refresh()} />
                  </div>
                ))
              ) : (
                <div style={{ textAlign: 'center' }}>
                  <Empty />
                </div>
              )}
              {inhabitant.length < 4 ? (
                <div style={{ textAlign: 'center' }}>
                  <Button
                    style={{ alignSelf: 'center' }}
                    shape="round"
                    icon={<PlusCircleOutlined />}
                    onClick={() => {
                      setUserRule('Inhabitant');
                      setAppendUserModalVisibility(!appendUserModalVisibility);
                    }}
                  >
                    Add inhabitant user
                  </Button>
                </div>
              ) : null}
            </TabPane>
            <TabPane tab="Tenant" key="tenant">
              {tenant.length ? (
                tenant.map((tenant, index) => (
                  <div key={'tenant' + index}>
                    <UsersInfo user={tenant} onEvent={() => refresh()} />
                  </div>
                ))
              ) : (
                <div style={{ textAlign: 'center' }}>
                  <Empty />
                </div>
              )}
              {tenant.length < 4 ? (
                <div style={{ textAlign: 'center' }}>
                  <Button
                    style={{ alignSelf: 'center' }}
                    shape="round"
                    icon={<PlusCircleOutlined />}
                    onClick={() => {
                      setUserRule('Tenant');
                      setAppendUserModalVisibility(!appendUserModalVisibility);
                    }}
                  >
                    Add tenant user
                  </Button>
                </div>
              ) : null}
            </TabPane>
            <TabPane tab="Auto Parking QR Code" key="qrCode">
              <div
                style={{
                  display: 'flex',
                  flex: 1,
                  justifyContent: 'center',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '70%',
                    minHeight: 500,
                    padding: 40,
                    paddingLeft: 60,
                    paddingRight: 60,
                    border: '1px solid #706F6C',
                    borderRadius: 20,
                    justifyContent: 'center',
                    marginBottom: 30,
                  }}
                >
                  {img && qrCode ? (
                    <>
                      <img
                        style={{ width: 375, height: 375 }}
                        src={process.env.REACT_APP_API_URL + qrCode}
                        alt="bg"
                      />
                      <Button
                        type="link"
                        style={{ float: 'right' }}
                        onClick={() => setImg(false)}
                      >
                        Change Image
                      </Button>
                    </>
                  ) : (
                    <>
                      {pickedImage ? (
                        <div>
                          <img
                            style={{ width: 375, aspectRatio: 1 }}
                            src={pickedImage}
                            alt="picked"
                          />
                          <Button
                            type="link"
                            icon={<DeleteOutlined />}
                            onClick={() => setPickedImage(null)}
                            style={{ width: 375, marginTop: 15 }}
                          >
                            Change image
                          </Button>
                        </div>
                      ) : (
                        <>
                          <label htmlFor="input">
                            <div
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                                width: '100%',
                                height: 400,
                                textAlign: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <img
                                style={{
                                  width: 100,
                                  height: 80,
                                  alignSelf: 'center',
                                  marginBottom: 20,
                                  justifySelf: 'center',
                                }}
                                src={imgIcon}
                                alt="bg"
                              />
                              <p>Click to upload image</p>
                            </div>
                          </label>
                          <input
                            type="file"
                            id="input"
                            accept="image/*"
                            onChange={(e) => {
                              // console.log(e.target.files);
                              setImageFile(e.target.files);
                              selectHandle(e);
                              setEnable(false);
                            }}
                            onClick={(event) => {
                              event.target.value = null;
                            }}
                            style={{
                              display: 'none',
                              float: 'left',
                            }}
                          />
                        </>
                      )}
                    </>
                  )}
                </div>
                <Button
                  style={{ alignSelf: 'flex-end' }}
                  type="primary"
                  shape="round"
                  disabled={enable}
                  // disabled={false}
                  onClick={() => {
                    // console.log(addressId);
                    handleQrCode(imageFile, addressId);
                  }}
                >
                  Save change
                </Button>
              </div>
            </TabPane>
          </Tabs>
        </div>
      </Modal>
      <AppendUserModal
        userRule={userRule}
        visible={appendUserModalVisibility}
        id={id}
        onCancel={() => {
          setAppendUserModalVisibility(!appendUserModalVisibility);
          refresh();
        }}
      />
    </>
  );
};
