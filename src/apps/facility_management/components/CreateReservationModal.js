import { Button, Calendar, Form, Input, Modal, Radio, Select } from 'antd';
import { differenceInMinutes, format } from 'date-fns';
import { addDoc, collection } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import authService from '../../../services/authServices';
import { db } from '../../../utils/firebaseConfig';
import QrModal from './QrModal';
import './styles/create_modal.css';

const CreateReservationModal = ({ visible, id, onExit }) => {
  const [createReservationForm] = Form.useForm();
  const { reserves, facilities } = useSelector(state => state.FacilitiesManagementReducer);
  let facility = facilities?.find(facility => facility.id === id);
  const [residents, setResidents] = useState(null);
  const [selectedResident, setSelectedResident] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString());
  const [selectSlot, setSelectSlot] = useState();
  const [countReserves, setCountReserves] = useState({});
  const [qrModalVisible, setQrModalVisible] = useState(false);
  const [handleId, setHandleId] = useState(null);
  
  useEffect(() => {
    (async () => {
      const { status, data } = await authService.getAllResident();
      if (status === 200) {
        
        setResidents(data);
      }
    })();
  }, []);
  
  const onSelectDate = (value) => {
    mapReserveToSlot();
    setSelectedDate(value.toISOString());
  };
  
  const handleCreateReservation = (e) => {
    e.preventDefault();
    createReservationForm.validateFields().then(async (v) => {
      let formValue = {
        ...v,
        bookedBy: 'Juristic',
        bookedDate: createTimeStamp(selectSlot?.startTime),
        facilityName: facility?.name,
        date: format(new Date(selectedDate), 'yyyy-MM-dd'),
        note: v.note ? v.note : '',
        topic: v.topic ? v.topic : '',
        facilityId: facility.id,
        facilityCover: facility.cover,
        statusNotification: false,
        userFullName: selectedResident.fullname,
        userTel: selectedResident.tel,
        status: 0,
        slot: selectSlot?.slot,
      };
      const result = await addDoc(collection(db, 'reserves'), formValue);
      if (result) {
        console.log(result.id);
        let data = {
          id: result.id,
          ...formValue,
        };
        onExit();
        setHandleId(data);
        setQrModalVisible(prevState => !prevState);
      }
    });
  };
  
  const mapReserveToSlot = () => {
    const thisDay = selectedDate?.slice(0, 10);
    const dateReserves = reserves.filter((reserve) => reserve.date === thisDay);
    
    //* For filter only this block was improve by querySnapshot or use this function properly.
    const countReserve = dateReserves.reduce(
      (prev, curr) => ({
        ...prev,
        [curr.slot]: (prev[curr.slot] || 0) + 1,
      }),
      {},
    );
    setCountReserves(countReserve);
  };
  
  const createTimeStamp = (digit) => {
    
    const month = new Date(selectedDate).getMonth();
    const day = new Date(selectedDate).getDate();
    return new Date(selectedDate.slice(0, 4), month, day, digit, 0, 0, 0);
  };
  
  const pressSlotEvent = (event) => {
    let slot = facility.timeSlot.find(slot => slot.key === event.target.value);
    setSelectSlot(slot);
  };
  
  const onChange = (value) => {
    let selectResident = residents.find(resident => resident.id === value);
    setSelectedResident(selectResident);
  };
  
  return (
    <div>
      <QrModal data={handleId}
               visible={qrModalVisible}
               onCancel={() => setQrModalVisible(prevState => !prevState)} />
      <Modal visible={visible}
             centered title={'Create Reservation'}
             footer={[
               <Button size='large'
                       shape='round'
                       type='primary'
                       onClick={(e) =>
                         handleCreateReservation(e)
                       }
               >
                 Create
               </Button>,
             ]}
             onCancel={() => {
               createReservationForm.resetFields();
               onExit();
             }}>
        <Form form={createReservationForm}
              layout={'vertical'}>
          <Form.Item label={'Facility'}>
            <div className={'input-tel'}>{facility?.name}</div>
          </Form.Item>
          <Form.Item label={'Booked By'}>
            <div className={'input-tel'}>{'Juristic'}</div>
          </Form.Item>
          <Form.Item label={'Resident'}
                     name={'userId'}
                     rules={[
                       {
                         required: true,
                         message: 'Please pick a resident!',
                       },
                     ]}>
            <Select showSearch
                    onChange={onChange}
                    placeholder='Select a person'
                    optionFilterProp='children'
                    filterOption={(input, option) => option.children.toLowerCase()
                    .includes(input.toLowerCase())}
            >
              {residents
               ? residents.map(
                  (user) => (
                    <Select.Option key={user.id}
                                   value={user.fullName}
                    >
                      {user.fullname}
                    </Select.Option>))
               : null}
            </Select>
          </Form.Item>
          <Form.Item name={'topic'}
                     label={'Topic'}>
            <Input initialvalues={''} />
          </Form.Item>
          <Form.Item name={'note'}
                     label={'Note'}>
            <Input.TextArea allowClear={true} initialvalues={''} />
          </Form.Item>
          <Form.Item name={'date'}
                     label={'Date'}
                     rules={[
                       {
                         required: true,
                         message: 'Please pick a date!',
                       },
                     ]}>
            <Calendar fullscreen={false}
                      onChange={(v) => onSelectDate(v)} />
          </Form.Item>
          <Form.Item name='slot'
                     label='Pick a slot'
                     rules={[
                       {
                         required: true,
                         message: 'Please pick a slot!',
                       },
                     ]}
          >
            <Radio.Group onChange={(e) => pressSlotEvent(e)}>
              {facility ? facility?.timeSlot?.map(slot =>
                (<Radio.Button value={slot.key}
                               disabled={
                                 countReserves[slot.slot] ===
                                 facility.maxReserves ||
                                 differenceInMinutes(
                                   createTimeStamp(
                                     slot.endTime),
                                   new Date()) < 0
                               }>{slot.slot}</Radio.Button>),
              ) : null}
            </Radio.Group>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CreateReservationModal;
