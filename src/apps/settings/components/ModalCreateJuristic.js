import {DeleteOutlined} from '@ant-design/icons';
import {Button, Form, Input, message, Modal} from 'antd';
import React, {useState} from 'react';
import authService from '../../../services/authServices';
import uploadService from '../../../services/uploadServices';
import ImageIcon from '../../registration/assets/icons/image.svg';

const ModalCreateJuristic = ({visible, cancelHandler, onRefresh}) => {
  const [createJuristicForm] = Form.useForm();
  const [imageFile, setImageFile] = useState(null);
  const [pickedImage, setPickedImage] = useState(null);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const selectImage = (e) => {
    setImageFile(e.target.files[0]);
    const reader = new FileReader();
    reader.onload = (e) => {
      if (reader.readyState === 2) {
        setPickedImage(reader.result);
      }
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  function makeUname(length) {
    let result = '';
    let characters =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  const createAccount = async (value, imageData) => {
    return new Promise(async (resolve, reject) => {
      try {
        const {data} = await uploadService.uploadImage(imageData);
        if (data) {
          const newValue = {image: data[0], ...value};
          // console.log(typeof newValue);
          try {
            const {data} = await authService.registration(newValue);
            if (data) {
              try {
                await authService.editUserData(data.user.id, {
                  role: '61b32a96268f0d019c9c0dff',
                });
                resolve('Success');
                onRefresh();
              } catch (error) {
                console.error(error);
              }
            }
          } catch (e) {
            reject(new Error(e.message));
          }
        }
      } catch (e) {
        reject(new Error(e.message));
      }
    });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setConfirmLoading(true);
    const imageData = new FormData();
    imageData.append('files', imageFile);
    const value = await createJuristicForm.validateFields();
    if (value) {
      let name = value.name.split(' ');
      let submitValue = {
        username: makeUname(8),
        password: 'hyde_thonglor',
        email: value.email,
        fullname: value.name,
        firstname: name[0],
        lastname: name[1],
        tel: value.tel,
        project: '61b464ff4abbaa01b461bc5f',
      };
      // console.log(submitValue);
      try {
        const result = await createAccount(submitValue, imageData);
        if (result) {
          message.success('Registration successfully');
          cancelHandler();
        }
      } catch (e) {
        setConfirmLoading(false);
      }
    }
  };

  return (
      <Modal
          title='Add New Juristic'
          visible={visible}
          onCancel={cancelHandler}
          destroyOnClose={true}
          onOk={handleCreate}
          confirmLoading={confirmLoading}
      >
        <Form form={createJuristicForm} layout={'vertical'}>
          <Form.Item label={'Image'}>
            <div className='select-img'>
              {pickedImage ? null : (
                  <div className='avatar'>
                    <label htmlFor='input'>
                      <img src={ImageIcon} alt='upload'
                           className='img-upload' />
                      <p style={{color: 'white', fontSize: 18}}>
                        Click to upload image
                      </p>
                    </label>
                  </div>
              )}
              <input
                  type='file'
                  id='input'
                  accept='image/*'
                  onChange={selectImage}
                  onClick={(event) => {
                    event.target.value = null;
                  }}
                  style={{
                    display: 'none',
                    float: 'left',
                  }}
              />
              {pickedImage ? (
                  <div className='picked-avatar'>
                    <img
                        className='picked-avatar-image'
                        src={pickedImage}
                        alt='picked'
                    />
                    <Button
                        type='link'
                        icon={<DeleteOutlined />}
                        onClick={() => setPickedImage(null)}
                        style={{float: 'right'}}
                    >
                      Change image
                    </Button>
                  </div>
              ) : null}
              {!pickedImage ? (
                  <p style={{color: 'red'}}>* Please upload image</p>
              ) : null}
            </div>
          </Form.Item>
          <Form.Item
              name='name'
              label='Name'
              rules={[
                {
                  required: true,
                  message: 'Please enter a name',
                },
              ]}
          >
            <Input placeholder='Enter Name' />
          </Form.Item>
          <Form.Item
              name='tel'
              label='Tel.'
              rules={[
                {
                  required: true,
                  message: 'Please enter a name',
                },
              ]}
          >
            <Input placeholder='Enter Name' />
          </Form.Item>
          <Form.Item
              name='email'
              label='Email Address'
              rules={[
                {
                  required: true,
                  message: 'Please enter a name',
                },
                {
                  type: 'email',
                  message: 'The input is not valid E-mail!',
                },
              ]}
          >
            <Input placeholder='Enter Name' />
          </Form.Item>
          <Form.Item label='Role' name='role'>
            <div className='role_box'>Juristic</div>
          </Form.Item>
        </Form>
      </Modal>
  );
};

export default ModalCreateJuristic;
