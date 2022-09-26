import { DeleteOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input, InputNumber, message, Modal, Select, Space } from 'antd';
import { doc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../../../utils/firebaseConfig';
import imgIcon from '../assets/img.svg';

// File Reader ready State
const [EMPTY, LOADING, DONE] = [0, 1, 2];

const EditFacilityModal = ({ visible, value, onExit }) => {
  const [pickedImage, setPickedImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [img, setImg] = useState(true);
  const [timeSlots, setTimeSlots] = useState([]);
  const [dailyStart, setDailyStart] = useState();
  const [dailyStop, setDailyStop] = useState();
  
  const [editFacilityForm] = Form.useForm();
  
  useEffect(() => {
    if (value?.timeSlot) {
      setTimeSlots(value.timeSlot);
    }
  }, [value]);
  
  const handleSuccess = () => {
    setTimeSlots([]);
    editFacilityForm.resetFields();
    setDailyStart();
    setDailyStop();
    message.success('Save Change Successfully');
    onExit();
  };
  
  const submitHandler = async () => {
    Modal.confirm({
                    title            : 'Are you sure you want to edit facilities?',
                    okButtonProps    : { shape: 'round', size: 'large', type: 'primary' },
                    cancelButtonProps: { shape: 'round', size: 'large' },
                    icon             : null,
                    autoFocusButton  : null,
                    centered         : true,
                    onOk() {
                      return new Promise(async (resolve, reject) => {
                        await editFacilityForm
                        .validateFields()
                        .then(async (formValue) => {
                          const documentRef = doc(db, 'facilities', value?.id);
                          if (pickedImage) {
                            let file = imageFile;
                            const storage = getStorage();
                            const storageRef = ref(storage, 'facilities_image/' + file.name);
                            const snapshot = uploadBytes(storageRef, file);
                            if (snapshot) {
                              const downloadUrl = getDownloadURL(snapshot.ref);
                              let value = {
                                ...formValue,
                                cover   : downloadUrl,
                                timeSlot: timeSlots,
                              };
                              updateDoc(documentRef, value)
                              .catch((err) => {
                                reject(err);
                              })
                              .then(() => {
                                resolve('SUCCESS');
                                handleSuccess();
                              });
                            }
                          } else {
                            let value = {
                              ...formValue,
                              timeSlot: timeSlots,
                            };
                            updateDoc(documentRef, value)
                            .catch((err) => {
                              reject(err);
                            })
                            .then(() => {
                              resolve('SUCCESS');
                              handleSuccess();
                            });
                          }
                        });
                      });
                    },
                    async onCancel() {
                      editFacilityForm.resetFields();
                      setTimeSlots([]);
                      await onExit();
                    },
                  });
    
  };
  
  const selectImage = (e) => {
    setImageFile(e.target.files[0]);
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === DONE) {
        setPickedImage(reader.result);
      }
    };
    reader.readAsDataURL(e.target.files[0]);
  };
  
  const hours = [];
  for (let i = 0; i < 24; i++) {
    hours.push(
        <Select.Option key={i.toString()} value={i}>
          {i.toString().length < 2 ? '0' + i.toString() : i.toString()}:00
        </Select.Option>,
    );
  }
  
  const createTimeSlot = () => {
    let slots = [...timeSlots] ?? [];
    let st = value.daily_start.toString();
    let et = (value.daily_start + 1).toString();
    let startSlotName = st.length < 2
                        ? '0' + st + ':00'
                        : st + ':00';
    let endSlotName = et.length < 2
                      ? '0' + et + ':00'
                      : et + ':00';
    
    let slotData = {
      key      : uuidv4(),
      startTime: value?.daily_start,
      endTime  : value?.daily_start + 1,
      slot     : startSlotName + '-' + endSlotName,
    };
    slots.push(slotData);
    setTimeSlots(slots);
  };
  
  const handleSlotChange = (index, digit, v) => {
    let totalSlot = [...timeSlots];
    let changeSlot = totalSlot[index];
    
    let st = v.toString();
    let slotName = st.length < 2
                   ? '0' + st + ':00'
                   : st + ':00';
    
    let slotNameIndex = changeSlot.slot.split('-');
    
    if (digit) {
      slotNameIndex[1] = slotName;
      changeSlot = { ...changeSlot, endTime: v, slot: slotNameIndex[0] + '-' + slotNameIndex[1] };
    } else {
      slotNameIndex[0] = slotName;
      changeSlot = { ...changeSlot, startTime: v, slot: slotNameIndex[0] + '-' + slotNameIndex[1] };
    }
    totalSlot[index] = changeSlot;
    setTimeSlots(totalSlot);
  };
  
  const handleRemoveSlot = (index) => {
    let totalSlot = [...timeSlots];
    totalSlot.splice(index, 1);
    setTimeSlots(totalSlot);
  };
  
  const initialFormValue = {
    name        : value?.name,
    detail      : value?.detail,
    description : value?.description,
    accommodates: value?.accommodates,
    rules       : value?.rules,
    maxReserves : value?.maxReserves,
  };
  
  return (
      <Modal key={value?.id}
             visible={visible}
             centered
             onCancel={() => onExit()}
             title={'Edit Facility'}
             footer={[
               <Button type='primary'
                       size='large'
                       shape='round'
                       onClick={() => submitHandler()}
               >
                 Save
               </Button>,
             ]}
      >
        <Form form={editFacilityForm} layout={'vertical'} initialValues={initialFormValue}>
          <Form.Item label='Room Name' name='name'
                     rules={[{ required: true, message: 'Facility name is required' }]}>
            <Input />
          </Form.Item>
          <Form.Item label='Room Name Detail' name='detail'
                     rules={[{ required: true, message: 'Facility detail is required' }]}>
            <Input />
          </Form.Item>
          
          <Form.Item label='Description' name='description'
                     rules={[
                       {
                         required: true, message: 'Facility description is required',
                       },
                     ]}>
            <Input.TextArea autoSize={{ minRows: 3, maxRows: 5 }} />
          </Form.Item>
          <Form.Item label='Daily Hours'>
            <div style={{
              width         : '100%',
              flexDirection : 'row',
              marginBottom  : 20,
              display       : 'flex',
              justifyContent: 'space-between',
              alignItems    : 'center',
            }}>
              From
              <Select style={{ width: 180 }}
                      value={dailyStart ?? value?.daily_start}
                      initialValues={value ?? value?.daily_start}
                      onChange={setDailyStart}
              >
                {hours}
              </Select>
              To
              <Select style={{ width: 180 }}
                      value={dailyStop ?? value?.daily_stop}
                      initialValues={value ?? value?.daily_stop}
                      onChange={setDailyStop}
              >
                {hours}
              </Select>
            </div>
          </Form.Item>
          <Form.Item label='Image'>
            <div>
              {img ? (
                  <>
                    <img className='facility-image'
                         src={value ? value.cover : null}
                         alt='bg'
                    />
                    <Button icon={<DeleteOutlined />}
                            type='link'
                            style={{ float: 'right' }}
                            onClick={() => setImg(false)}
                    >
                      Change Image
                    </Button>
                  </>
              ) : (
                   <>
                     {!pickedImage ? (
                         <>
                           <label htmlFor='input'>
                             <div className='facility-image'>
                               <img src={imgIcon}
                                    alt='bg'
                                    style={{ marginTop: 80 }}
                               />
                               <p>Click to upload image</p>
                             </div>
                           </label>
                           <input type='file'
                                  id='input'
                                  accept='image/*'
                                  onChange={selectImage}
                                  onClick={(event) => {
                                    event.target.value = null;
                                  }}
                                  style={{
                                    display: 'none',
                                    float  : 'left',
                                  }}
                           />
                           <p style={{ color: 'red' }}>
                             * Please upload image
                           </p>
                         </>
                     ) : (
                          <div>
                            <img className='facility-image'
                                 src={pickedImage}
                                 alt='picked'
                            />
                            <Button type='link'
                                    icon={<DeleteOutlined />}
                                    onClick={() => setPickedImage(null)}
                                    style={{ float: 'right' }}
                            >
                              Change image
                            </Button>
                          </div>
                      )}
                   </>
               )}
            </div>
          </Form.Item>
          <div style={{ marginBottom: 10 }}>Accommodates</div>
          <Form.List name='accommodates'>
            {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                      <Space key={key}
                             style={{ display: 'inline' }}
                             align='baseline'
                      >
                        <Form.Item name={[name]}{...restField}
                                   rules={[
                                     {
                                       required: true,
                                       message : 'Missing accommodate item',
                                     },
                                   ]}
                        >
                          <Input placeholder='accommodate item'
                                 suffix={
                                   <MinusCircleOutlined
                                       onClick={() => remove(name)} />
                                 } />
                        </Form.Item>
                      </Space>
                  ))}
                  <Form.Item>
                    <Button type='dashed' onClick={() => add()} block
                            icon={<PlusOutlined />}>
                      Add accommodates
                    </Button>
                  </Form.Item>
                </>
            )}
          </Form.List>
          <div style={{ marginBottom: 10 }}>Rules</div>
          <Form.List name='rules'>
            {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                      <Space key={key}
                             style={{ display: 'inline' }}
                             align='baseline'
                      >
                        <Form.Item name={[name]} {...restField}
                                   rules={[
                                     {
                                       required: true,
                                       message : 'Missing rule item',
                                     },
                                   ]}
                        >
                          <Input placeholder='rule item' suffix={
                            <MinusCircleOutlined onClick={() => remove(name)} />
                          } />
                        </Form.Item>
                      </Space>
                  ))}
                  <Form.Item>
                    <Button type='dashed' onClick={() => add()} block
                            icon={<PlusOutlined />}>
                      Add rules
                    </Button>
                  </Form.Item>
                </>
            )}
          </Form.List>
          <Form.Item label='Reserves per Time-Slot' name='maxReserves'
                     rules={[{ required: true, message: 'Max reserves is required' }]}>
            <InputNumber initialValues={1}
                         min={1}
                         style={{ width: '100%', borderRadius: 20 }}
            />
          </Form.Item>
          <div style={{ marginBottom: 10 }}>Time Slot
            <div style={{ color: 'red' }}>*Time-Slot mustn't duplicate or empty</div>
          </div>
          {timeSlots.length > 0
           ? timeSlots.map((timeSlot, idx) => (
                  <div key={timeSlot.key}
                       style={{
                         width         : '100%',
                         flexDirection : 'row',
                         marginBottom  : 20,
                         display       : 'flex',
                         justifyContent: 'space-between',
                         alignItems    : 'center',
                       }}>
                    {`Slot ${idx + 1} :`}
                    <Select style={{ width: 180 }}
                            value={timeSlot.startTime}
                            initialValues={timeSlot.startTime}
                            onChange={(v) => handleSlotChange(idx, 0, v)}
                    >
                      {hours}
                    </Select>to
                    <Select style={{ width: 180 }}
                            value={timeSlot.endTime}
                            initialValues={timeSlot.endTime}
                            onChange={(v) => handleSlotChange(idx, 1, v)}
                    >
                      {hours}
                    </Select>
                    <MinusCircleOutlined onClick={() => handleRemoveSlot(idx)} />
                  </div>
              ))
           : null}
          <Button type='dashed'
                  onClick={() => createTimeSlot()}
                  block
                  disabled={timeSlots.length <= 0}
                  icon={
                    <PlusOutlined />
                  }>
            Add slot
          </Button>
        </Form>
      </Modal>
  );
};

export default EditFacilityModal;
