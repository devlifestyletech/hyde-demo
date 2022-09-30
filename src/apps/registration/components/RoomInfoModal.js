import React, { useState } from 'react';
import {
  Empty,
  Button,
  Modal,
  Tabs,
  Input,
  Row,
  Col,
  Typography,
  Space,
  Form,
  notification,
} from 'antd';
import axios from 'axios';
import { encryptStorage } from '../../../utils/encryptStorage';
import './styles/addresses.css';

//components
import AppendUserModal from './AppendUserModal';
import { PlusCircleOutlined } from '@ant-design/icons';
import UsersInfo from './UserInfo';
import ConfirmModal from '../../../components/Modal/ConfirmModal';
import { FormOutlined } from '@ant-design/icons';

const { TabPane } = Tabs;
const { Text } = Typography;

export const RoomInfoModal = ({
  visible,
  onCancel,
  id,
  owner,
  inhabitant,
  tenant,
  refresh,
  addressId,
  qrOpenGate,
  qrCodeSmartLocker,
}) => {
  const session = encryptStorage.getItem('user_session');
  const header = {
    headers: {
      Authorization: 'Bearer ' + session.jwt,
    },
  };
  const [form] = Form.useForm();
  const [userRule, setUserRule] = useState(null);
  const [editable, setEditable] = useState(false);
  const [qrValues, setQrValues] = useState({});
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [appendUserModalVisibility, setAppendUserModalVisibility] =
    useState(false);

  //functions
  const onSave = async (qrGate, qrSmart) => {
    let result;
    try {
      result = await axios.put(
        `${process.env.REACT_APP_API_URL}/addresses/${addressId}`,
        {
          qr_code_open_gate: qrGate,
          qr_code_smart_locker: qrSmart,
        },
        header
      );
      if (result) {
        notification['success']({
          duration: 2,
          message: 'Add QR code',
          description: 'Add QR code successfully.',
          style: { borderRadius: '25px' },
        });
        setConfirmVisible(false);
      }
    } catch (error) {
      console.warn(error);
    }
  };
  const handleValue = () => {
    form.setFieldsValue({
      qrGate: qrOpenGate,
      qrSmart: qrCodeSmartLocker,
    });
  };
  // components
  const TabsQrCode = () => {
    if (!qrOpenGate && !qrCodeSmartLocker && !editable) {
      return (
        <div style={{ textAlign: 'center' }}>
          <Empty />
          <Button
            shape="round"
            icon={<PlusCircleOutlined />}
            onClick={() => {
              setEditable(true);
            }}
          >
            Add new Qr code
          </Button>
        </div>
      );
    } else if (editable) {
      return (
        <Form
          layout="vertical"
          form={form}
          name="form_in_modal"
          initialValues={{
            modifier: 'public',
          }}
        >
          <Space
            direction="vertical"
            size={40}
            style={{ display: 'flex', marginTop: 30 }}
          >
            <div className="formAddNewQR">
              <Col>
                <Form.Item
                  label="QR Code Open Gate"
                  name="qrGate"
                  rules={[
                    {
                      required: true,
                      message: 'This field is required!',
                    },
                  ]}
                >
                  <Input className="inputAddQR" />
                </Form.Item>
              </Col>
              <Col>
                <Form.Item
                  label="QR Code Smart Locker"
                  name="qrSmart"
                  rules={[
                    {
                      required: true,
                      message: 'This field is required!',
                    },
                  ]}
                >
                  <Input className="inputAddQR" />
                </Form.Item>
              </Col>
            </div>
            <Col span={2} offset={22}>
              <Button
                type="primary"
                shape="round"
                size="large"
                onClick={(e) => {
                  e.preventDefault();
                  form
                    .validateFields()
                    .then((values) => {
                      setQrValues(values);
                      setConfirmVisible(true);
                      form.resetFields();
                    })
                    .catch((info) => {
                      console.warn(info);
                    });
                }}
              >
                Save
              </Button>
            </Col>
          </Space>
        </Form>
      );
    }
    return (
      <Col>
        <div className="more">
          <FormOutlined
            onClick={() => {
              handleValue();
              setEditable(true);
            }}
            style={{
              fontSize: 20,
              fontWeight: 'bold',
            }}
          />
        </div>
        <Row
          style={{ paddingTop: 40, paddingBottom: 40 }}
          justify="space-evenly"
        >
          <Col>
            <Space direction="vertical">
              <Text strong>QR Code Open Gate</Text>
              <Text>{qrOpenGate ?? 'No Data'}</Text>
            </Space>
          </Col>
          <Col>
            <Space direction="vertical">
              <Text strong>QR Code Smart Locker</Text>
              <Text>{qrCodeSmartLocker ?? 'No Data'}</Text>
            </Space>
          </Col>
        </Row>
      </Col>
    );
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
              {owner ? (
                <div>
                  <UsersInfo
                    user={owner}
                    userRule={'Owner'}
                    onEvent={refresh}
                  />
                </div>
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
            {owner ? (
              <>
                <TabPane tab="Inhabitant" key="inhabitant">
                  {inhabitant.length ? (
                    inhabitant.map((inhabitant, index) => (
                      <div key={'inhabitant' + index}>
                        <UsersInfo
                          user={inhabitant}
                          userRule={'Inhabitant'}
                          onEvent={refresh}
                        />
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
                          setAppendUserModalVisibility(
                            !appendUserModalVisibility
                          );
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
                        <UsersInfo
                          user={tenant}
                          userRule={'Tenant'}
                          onEvent={refresh}
                        />
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
                          setAppendUserModalVisibility(
                            !appendUserModalVisibility
                          );
                        }}
                      >
                        Add tenant user
                      </Button>
                    </div>
                  ) : null}
                </TabPane>
                <TabPane tab="QR Code" key="qrCode">
                  <TabsQrCode />
                </TabPane>
              </>
            ) : null}
          </Tabs>
        </div>
      </Modal>
      <AppendUserModal
        userRule={userRule}
        visible={appendUserModalVisibility}
        id={id}
        onCancel={() => {
          setAppendUserModalVisibility(!appendUserModalVisibility);
        }}
        refresh={refresh}
      />
      <ConfirmModal
        visible={confirmVisible}
        values={qrValues}
        content="Are you sure you want to save QR code?"
        onCancel={() => {
          setConfirmVisible(false);
        }}
        onConfirm={onSave}
      />
    </>
  );
};
