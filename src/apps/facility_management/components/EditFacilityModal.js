import { DeleteOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Form, Input, InputNumber, Modal, Select, Space } from 'antd'
import React, { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import imgIcon from '../assets/img.svg'

const EditFacilityModal = ({ visible, value, onExit }) => {
  const [pickedImage, setPickedImage] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [img, setImg] = useState(true)
  const [timeSlots, setTimeSlots] = useState([])
  const [dailyStart, setDailyStart] = useState()
  const [dailyStop, setDailyStop] = useState()

  const [editFacilityForm] = Form.useForm()

  if (value) {
    console.log({ value })
    let formValue = {
      ...value,
      accommodates: value.accommodates.map((accommodate) => ({ item: accommodate })),
      rules: value.rules.map((rule) => ({ item: rule })),
    }
    console.log({ formValue })
  }

  const submitHandler = async (e) => {
    await editFacilityForm.validateFields()
                          .then((v) => console.log('submit', v))
    // await onExit()
  }

  const selectImage = (e) => {
    setImageFile(e.target.files[0])
    const reader = new FileReader()
    reader.onload = () => {
      if (reader.readyState === 2) {
        setPickedImage(reader.result)
      }
    }
    reader.readAsDataURL(e.target.files[0])
  }

  const hours = []
  for (let i = 0; i < 24; i++) {
    hours.push(
      <Select.Option key={i.toString()} value={i}>
        {i.toString().length < 2 ? '0' + i.toString() : i.toString()}:00
      </Select.Option>,
    )
  }

  const createTimeSlot = () => {
    let slot = [...timeSlots]
    let st = value.daily_start.toString()
    let et = (value.daily_start + 1).toString()
    let startSlotName = st.length < 2
      ? '0' + st + ':00'
      : st + ':00'
    let endSlotName = et.length < 2
      ? '0' + et + ':00'
      : et + ':00'

    let slotData = {
      slotId: uuidv4(),
      startTime: value?.daily_start,
      endTime: value?.daily_start + 1,
      slot: startSlotName + '-' + endSlotName,
    }
    slot.push(slotData)
    setTimeSlots(slot)
  }

  const handleSlotChange = (index, digit, v) => {
    let totalSlot = [...timeSlots]
    let changeSlot = totalSlot[index]

    let st = v.toString()
    let slotName = st.length < 2
      ? '0' + st + ':00'
      : st + ':00'

    let slotNameIndex = changeSlot.slot.split('-')

    if (digit) {
      slotNameIndex[1] = slotName
      changeSlot = { ...changeSlot, endTime: v, slot: slotNameIndex[0] + '-' + slotNameIndex[1] }
    } else {
      slotNameIndex[0] = slotName
      changeSlot = { ...changeSlot, startTime: v, slot: slotNameIndex[0] + '-' + slotNameIndex[1] }
    }
    totalSlot[index] = changeSlot
    setTimeSlots(totalSlot)
  }

  const handleRemoveSlot = (index) => {
    let totalSlot = [...timeSlots]
    totalSlot.splice(index, 1)
    setTimeSlots(totalSlot)
  }

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
      <Form form={editFacilityForm} layout={'vertical'}>
        <Form.Item label='Room Name' name='name'>
          <Input />
        </Form.Item>
        <Form.Item label='Room Name Detail' name='detail'>
          <Input />
        </Form.Item>

        <Form.Item label='Description' name='description'>
          <Input.TextArea autoSize={{ minRows: 3, maxRows: 5 }} />
        </Form.Item>
        <Form.Item label='Daily Hours'>
          <div style={{
            width: '100%',
            flexDirection: 'row',
            marginBottom: 20,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            From
            <Select style={{ width: 180 }}
                    value={dailyStart}
                    initialValues={value ? value.daily_start : null}
                    onChange={setDailyStart}
            >
              {hours}
            </Select>
            To
            <Select style={{ width: 180 }}
                    value={dailyStop}
                    initialValues={value ? value.daily_stop : null}
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
                             event.target.value = null
                           }}
                           style={{
                             display: 'none',
                             float: 'left',
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
                  <Form.Item name={[name, 'item']}{...restField}
                             rules={[
                               {
                                 required: true,
                                 message: 'Missing accommodate item',
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
                  <Form.Item name={[name, 'item']} {...restField}
                             rules={[
                               {
                                 required: true,
                                 message: 'Missing rule item',
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
        <Form.Item label='Reserves per Time-Slot' name='max_users'>
          <InputNumber initialValues={1}
                       min={1}
                       style={{ width: '100%', borderRadius: 20 }}
          />
        </Form.Item>
        <div style={{ marginBottom: 10 }}>Time Slot</div>
        {timeSlots.length > 0
          ? timeSlots.map((timeSlot, idx) => (
            <div key={timeSlot.slotId}
                 style={{
                   width: '100%',
                   flexDirection: 'row',
                   marginBottom: 20,
                   display: 'flex',
                   justifyContent: 'space-between',
                   alignItems: 'center',
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
                icon={
                  <PlusOutlined />
                }>
          Add slot
        </Button>
      </Form>
    </Modal>
  )
}

export default EditFacilityModal
