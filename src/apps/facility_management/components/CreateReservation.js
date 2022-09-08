import {
  Button, Col, DatePicker, Form, Input, InputNumber, message, Modal, Row,
  Select,
} from 'antd';
import {
  addDays, areIntervalsOverlapping, differenceInMinutes, hoursToMinutes,
} from 'date-fns';
import {addDoc, collection} from 'firebase/firestore';
import moment from 'moment';
import React, {useEffect, useState} from 'react';

//firebase firestore components
import {db} from '../../../utils/firebaseConfig';
import QrReservationModal from './QrReservationModal';
import './styles/create_modal.css';

const {Option} = Select;
const {RangePicker} = DatePicker;
const {TextArea} = Input;

export default function CreateReservation({
  facility,
  time_slot,
  addresses,
  visible,
  onCancel,
}) {
  const [resId, setResId] = React.useState();
  const [qrModalVisible, setQrModalVisible] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [createReservationForm] = Form.useForm();

  useEffect(() => {

  }, []);

  if (selectedAddress) {
    var address = addresses.find((address) => address.id === selectedAddress);
  }
  if (selectedUser) {
    var user = address.users.find((user) => user.id === selectedUser);
  }

  const onConfirm = (val) => {
    Modal.confirm({
      title: 'Are you sure you want to create booking?',
      okButtonProps: {shape: 'round', size: 'large', type: 'primary'},
      cancelButtonProps: {shape: 'round', size: 'large'},
      icon: null,
      autoFocusButton: null,
      centered: true,
      onOk() {
        let data = {
          topic: val.topic ? val.topic : '',
          user: address?.owner.id,
          tel: address?.owner.tel,
          room_number: address.address_number,
          facility_id: facility.id,
          facility_cover: facility.cover,
          name: address?.owner.fullname,
          facility_name: facility.name,
          startDateTime: val.range[0]._d,
          endDateTime: val.range[1]._d,
          user_amount: val.number_of_people,
          note: val.note ? val.note : '',
          booked: 'Juristic',
          status: 0,
        };
        let timeSlot = {
          start: new Date(val.range[0]),
          end: new Date(val.range[1]),
        };
        let daily_startTime = new Date(val.range[0]).setHours(
            facility.daily_start,
            0,
            0,
            0,
        );
        let daily_stopTime =
            facility.daily_stop === 0
                ? addDays(new Date(val.range[0]).setHours(0, 0, 0, 0), 1)
                : new Date(val.range[0]).setHours(facility.daily_stop, 0, 0, 0);
        return new Promise((resolve, reject) => {
          if (
              differenceInMinutes(
                  new Date(val.range[1]),
                  new Date(val.range[0]),
              ) > hoursToMinutes(facility.max_hours)
          ) {
            createError(
                'Error Time schedule',
                'Time schedule you picked is over max hours limit',
            );
          } else if (time_slot.length > 0) {
            let available = false;
            for (const interval of time_slot) {
              if (!areIntervalsOverlapping(interval, timeSlot)) {
                available = true;
              } else {
                available = false;
                break;
              }
            }
            if (available) {
              createReservation(data).then((docRef) => {
                resolve();
                message.success('Create Booking Successfully');
                setResId({
                  id: docRef.id,
                  tel: user ? user.tel : null,
                  ...data,
                });
                setQrModalVisible(true);
              });
            } else {
              createError(
                  'Error unavailable',
                  'Time schedule you picked is not available',
              );
            }
          } else if (
              differenceInMinutes(
                  new Date(val.range[0]),
                  new Date(daily_startTime),
              ) < 0
          ) {
            createError(
                'Error daily start time',
                'Start time you picked is not available',
            );
          } else if (
              differenceInMinutes(
                  new Date(daily_stopTime),
                  new Date(val.range[1]),
              ) < 0
          ) {
            createError(
                'Error daily stop time',
                'End time you picked is not available',
            );
          } else {
            createReservation(data).then((docRef) => {
              resolve();
              message.success('Create Booking Successfully');
              setResId({id: docRef.id, tel: user ? user.tel : null, ...data});
              setQrModalVisible(true);
            });
          }
        });
      },
      onCancel() {},
    });
  };

  const createReservation = async (data) => {
    return await addDoc(collection(db, 'reservations'), data);
  };

  function createError(title, content) {
    Modal.error({
      title: title,
      content: content,
      centered: true,
      okButtonProps: {shape: 'round', size: 'large', type: 'primary'},
      onOk() {
        Modal.destroyAll();
      },
    });
  }

  function disabledDate(current) {
    return current && current <= moment().startOf('day');
  }

  console.log(selectedAddress, address);

  return (
      <>
        <Modal
            centered
            width={1000}
            title='Create Reservation'
            visible={visible}
            onCancel={() => onCancel()}
            footer={[
              <Button
                  size='large'
                  shape='round'
                  type='primary'
                  onClick={() =>
                      createReservationForm.validateFields()
                          .then((val) => onConfirm(val))
                  }
              >
                Create
              </Button>,
            ]}
        >
          <Form layout='vertical' form={createReservationForm}>
            <Row>
              <Col span={12} style={{padding: 10}}>
                <div className='md-form'>
                  <div className='form-group'>
                    <Form.Item label='Room Name'>
                      <div className='input-tel'>
                        {facility
                            ? facility.name
                            : 'Select facility from top selection'}
                      </div>
                    </Form.Item>
                    <Form.Item
                        label='Topic'
                        rules={[
                          {
                            message: 'Please select booked!',
                          },
                        ]}
                        name='topic'
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                        label='Number of people'
                        name='number_of_people'
                        rules={[
                          {
                            required: true,
                            message: 'Please input user amount',
                          },
                        ]}
                    >
                      <InputNumber
                          min={1}
                          max={facility ? facility.max_users : null}
                          style={{width: '100%', borderRadius: 20}}
                      />
                    </Form.Item>
                    <Form.Item
                        label='Room Number'
                        rules={[
                          {
                            required: true,
                            message: 'Please select room number',
                          },
                        ]}
                        name='room_number'
                    >
                      <Select
                          showSearch
                          placeholder='Search to Select'
                          optionFilterProp='children'
                          filterOption={(input, option) =>
                              option.children.toLowerCase()
                                  .indexOf(input.toLowerCase()) >= 0
                          }
                          filterSort={(optionA, optionB) =>
                              optionA.children.toLowerCase()
                                  .localeCompare(optionB.children.toLowerCase())
                          }
                          onChange={(v) => setSelectedAddress(v)}
                      >
                        {addresses
                            ? addresses.map((address, index) => (
                                <Option key={index} value={address.id}>
                                  {address.address_number}
                                </Option>
                            ))
                            : null}
                      </Select>
                    </Form.Item>
                  </div>
                </div>
              </Col>
              <Col span={12} style={{padding: 10}}>
                <div className='md-form'>
                  <div className='form-group'>
                    <Form.Item
                        label='Name-Surname'
                        name='user'
                        rules={[
                          {
                            required: true,
                            message: 'Please select resident!',
                          },
                        ]}
                    >
                      <Select
                          showSearch
                          placeholder='Please select room number before select resident'
                          optionFilterProp='children'
                          filterOption={(input, option) =>
                              option.children.toLowerCase()
                                  .indexOf(input.toLowerCase()) >= 0
                          }
                          filterSort={(optionA, optionB) =>
                              optionA.children.toLowerCase()
                                  .localeCompare(optionB.children.toLowerCase())
                          }
                          onChange={setSelectedUser}
                      >
                        {address ? (
                            // address?.owner?.map((user, index) => (
                            <Option value={address.owner.id}>
                              {address.owner.fullname}
                            </Option>
                            // ))
                        ) : (
                            <Option disabled>
                              This address doesn't have any resident
                            </Option>
                        )}
                      </Select>
                    </Form.Item>
                    <Form.Item label='Telephone Number'>
                      <div className='input-tel'>
                        {address?.owner
                            ? address?.owner.tel
                            : 'Please select resident user'}
                      </div>
                    </Form.Item>
                    <Form.Item
                        label='Select the time to schedule'
                        name='range'
                        rules={[
                          {
                            required: true,
                            message: 'Please select time range!',
                          },
                        ]}
                    >
                      <RangePicker
                          showTime={{format: 'HH:mm'}}
                          format='YYYY-MM-DD HH:mm'
                          minuteStep={10}
                          disabledDate={disabledDate}
                      />
                    </Form.Item>
                    <Form.Item label='Note' name='note'>
                      <TextArea
                          placeholder=''
                          autoSize={{minRows: 4, maxRows: 6}}
                          defaultValue=''
                      />
                    </Form.Item>
                  </div>
                </div>
              </Col>
            </Row>
          </Form>
        </Modal>
        <QrReservationModal
            visible={qrModalVisible}
            onCancel={() => {
              setSelectedAddress(null);
              setSelectedUser(null);
              createReservationForm.resetFields();
              setQrModalVisible(false);
              onCancel();
            }}
            data={resId}
        />
      </>
  );
}
