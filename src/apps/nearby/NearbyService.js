/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react';
import Heading from '../../components/header';
import {
	AutoComplete,
	Button,
	Col,
	Divider,
	Form,
	Image,
	Input,
	message,
	Modal,
	Row,
	Select,
	Spin,
	Table,
	Tabs,
} from 'antd';
import { DeleteOutlined, PictureOutlined, PlusOutlined } from '@ant-design/icons';

import editIcon from './assets/icons/edit.svg';
import trashIcon from './assets/icons/trash.svg';
import noImg from './assets/images/noImg.jpg';

import './style/nearbyStyle.css';

import axios from 'axios';

import { GoogleMap, InfoWindow, Marker, withGoogleMap, withScriptjs } from 'react-google-maps';

import Geocode from 'react-geocode';

import { useLoadScript } from '@react-google-maps/api';

import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete';

import { encryptStorage } from '../../utils/encryptStorage';

const session = encryptStorage.getItem('user_session');

Geocode.setApiKey(process.env.REACT_APP_GOOGLE_MAPS_KEY);
Geocode.setLanguage('th');
const libraries = ['places'];

function NearbyService() {
  const URLreScrpit = process.env.REACT_APP_API_URL + '/nearby-recommends/';
  const headers = { headers: { Authorization: 'Bearer ' + session.jwt } };
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_KEY,
    libraries,
  });

  const types = [
    'All Service',
    'Shop',
    'Plumber',
    'Electronics',
    'Moving',
    'Laundry',
    'Cafe',
    'Restaurant',
  ];
  const { TabPane } = Tabs;
  const { Search } = Input;
  const { Option } = Select;
  const [data, setData] = useState([]);
  const [searchName, setSearchName] = useState('');
  const [searchTag, setSearchTag] = useState('');
  const [value, setValue] = useState(null);
  const [newVisible, setNewVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);

  useEffect(() => {
    console.log('session.jwt', session.jwt);
    fetchData();
  }, []);

  let columns = [
    {
      width: '2vw',
      title: 'No.',
      dataIndex: 'number',
      key: 'number',
    },
    {
      width: '5vw',
      title: 'Picture',
      dataIndex: 'picture',
      key: 'picture',
      render: (text) => (
        <>
          <Image width={300} height={200} src={text} alt={text} />
        </>
      ),
    },
    {
      width: '15vw',
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => (a.name > b.name ? 1 : -1),
    },
    {
      width: '20vw',
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
      // sorter: (a, b) => (a.location > b.location ? 1 : -1),
    },
    {
      width: '5vw',
      title: 'Tel',
      dataIndex: 'tel',
      key: 'tel',
    },
    {
      width: '5vw',
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      // sorter: (a, b) => (a.type > b.type ? 1 : -1),
    },
    {
      width: '5vw',
      align: 'center',
      title: 'Action',
      dataIndex: 'operation',
      render: (_, record) => (
        <div class="flex-container">
          <Button
            type="link"
            icon={<img src={editIcon} alt="Edit" />}
            onClick={() => handleEdit(record)}
          />
          <Divider type="vertical" style={{ height: 30 }} />
          <Button
            type="link"
            icon={<img src={trashIcon} alt="delete" />}
            onClick={() => onDelete(record.key)}
          />
        </div>
      ),
    },
  ];

  const fetchData = () => {
    axios
      // .get('http://54.179.47.77:1337/nearby-recommends',
      .get(URLreScrpit, headers)
      .then((response) => {
        console.log('data', response.data);
        let originData = [];

        response.data.map((item, idx) => {
          // console.log("place_image", item);
          return originData.push({
            key: item['id'] + ',' + item['latitude'] + ',' + item['longitude'],
            number: idx + 1,
            picture: item['place_image']
              ? `${process.env.REACT_APP_API_URL}${item['place_image']['url']}`
              : noImg,
            name: item['place_name'],
            location: item['address'],
            tel: item['telephone_number'],
            type: item['type'],
          });
        });
        setData(originData);
      });
  };

  const showModal = () => {
    setNewVisible(true);
  };

  const showEditModal = () => {
    setEditVisible(true);
  };

  const closeModal = () => {
    setNewVisible(false);
  };

  const closeEditModal = () => {
    setEditVisible(false);
    // setPickedImage(null);
    //setAddress(null);
  };

  const callback = (key) => {
    console.log(types[parseInt(key)]);
    setSearchTag(types[parseInt(key)]);
    setSearchName('');
  };

  const typePicked = (key) => {
    console.log(key);
  };

  const handleSearch = (value) => {
    setSearchName(value.toLowerCase());
  };

  const handleSearchChange = (value) => {
    if (value.target.value === '') {
      setSearchName('');
    }
  };

  const handleEdit = (record) => {
    console.log('Edit', record);
    setValue(record);
    showEditModal();
  };

  const onDelete = (key) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this service?',
      okButtonProps: { shape: 'round', size: 'large', type: 'primary' },
      cancelButtonProps: { shape: 'round', size: 'large' },
      icon: <DeleteOutlined style={{ color: 'red' }} />,
      autoFocusButton: null,
      centered: true,
      onOk() {
        // console.log("record.name", key.split(",")[0]);
        handleDelete(key);
      },
      onCancel() {
        // onCancel()
      },
    });
  };

  const handleDelete = async (key) => {
    const keyId = key.split(',')[0];
    await axios
      .delete(`${URLreScrpit}${keyId}`, headers)
      .then((result) => {
        fetchData();
        message.error('Service has been deleted successfully.');
        console.log('delete:', result);
        return result.status === 200 ? true : false;
      })
      .catch((err) => {
        return false;
      });
  };

  const EditService = ({ visible, editValue, onCancel }) => {
    console.log('rerender modal');
    const keyId = editValue.key.split(',')[0];
    const [form] = Form.useForm();
    const [pickedImage, setPickedImage] = useState(editValue.picture);
    const [latitude, setLatitude] = useState(
      parseFloat(editValue.key.split(',')[1])
    );
    const [longitude, setLongitude] = useState(
      parseFloat(editValue.key.split(',')[2])
    );
    const [address, setAddress] = useState(editValue.location);
    const [imageFile, setImageFile] = useState(null);
    const [imageBorder, setImageBorder] = useState('inputImageNB');
    const [mapBorder, setMapBorder] = useState('');

    const handleValue = () => {
      form.setFieldsValue({
        place_name: editValue.name,
        type: editValue.type,
        telephone_number: editValue.tel,
      });
    };
    useEffect(() => {
      handleValue();
    }, []);

    const isFirstRun = useRef(true);
    useEffect(() => {
      if (isFirstRun.current) {
        isFirstRun.current = false;
        return;
      } else {
        if (pickedImage) {
          setImageBorder('inputImageNB');
        } else {
          setImageBorder('inputNoImageNB');
        }
      }
    }, [pickedImage]);

    const deleteHandle = () => {
      setPickedImage(null);
      setImageFile(null);
    };

    const selectHandle = (e) => {
      setImageFile(e.target.files[0]);
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setPickedImage(reader.result);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    };

    const onMarkerDragEnd = (event) => {
      let newLat = event.latLng.lat();
      let newLng = event.latLng.lng();
      setLatitude(newLat);
      setLongitude(newLng);
      Geocode.fromLatLng(newLat, newLng).then((response) => {
        console.log('MAPresponse', response);
        setAddress(response.results[0].formatted_address);
      });
    };

    const MapWithAMarker = withScriptjs(
      withGoogleMap((props) => (
        <GoogleMap
          defaultZoom={18}
          defaultCenter={{ lat: latitude, lng: longitude }}
        >
          <Marker
            draggable={true}
            onDragEnd={onMarkerDragEnd}
            position={{ lat: latitude, lng: longitude }}
          >
            {address ? (
              <InfoWindow>
                <div>{address}</div>
              </InfoWindow>
            ) : null}
          </Marker>
        </GoogleMap>
      ))
    );

    function SearchMap() {
      const {
        ready,
        value,
        suggestions: { status, data },
        setValue,
        clearSuggestions,
      } = usePlacesAutocomplete({
        requestOptions: {
          location: {
            lat: () => 13.787664624326442,
            lng: () => 100.48204490167899,
          },
          radius: 200 * 100,
        },
      });

      const [options, setOptions] = useState([]);

      const onSearch = (searchText) => {
        searchText ? setValue(searchText) : clearSuggestions();
      };

      useEffect(() => {
        const arr = [];
        status === 'OK' &&
          data.map(({ description }) => {
            arr.push({ value: description });
          });
        setOptions(arr);
      }, [value]);

      return (
        <AutoComplete
          options={options}
          style={{
            width: '100%',
            borderRadius: 20,
            padding: 4,
            paddingLeft: 20,
            outline: 'none',
            marginBottom: 12,
          }}
          onSelect={async (address) => {
            try {
              console.log('address', address);
              const result = await getGeocode({ address });
              const { lat, lng } = await getLatLng(result[0]);
              console.log('result', result);
              console.log('result_latlng', lat, lng);
              setLatitude(lat);
              setLongitude(lng);
              setAddress(result[0].formatted_address);
            } catch (e) {
              console.log('error!', e);
            }
          }}
          onSearch={onSearch}
          disabled={!ready}
          placeholder="Search by location"
        />
      );
    }

    const onConfirm = (newValues) => {
      Modal.confirm({
        title: 'Are you sure you want to update this service?',
        okButtonProps: { shape: 'round', size: 'large', type: 'primary' },
        cancelButtonProps: { shape: 'round', size: 'large' },
        icon: null,
        autoFocusButton: null,
        centered: true,
        onOk() {
          form.resetFields();
          handleEditChange(newValues);
        },
        onCancel() {
          // onCancel()
        },
      });
    };

    const handleEditChange = async (value) => {
      if (imageFile == null) {
        console.log('no Img');
        await axios
          .put(
            `${URLreScrpit}${keyId}`,
            {
              place_name: `${value['place_name']}`,
              type: `${value['type']}`,
              telephone_number: `${value['telephone_number']}`,
              address: `${address}`,
              latitude: `${latitude}`,
              longitude: `${longitude}`,
            },
            headers
          )
          .then((result) => {
            fetchData();
            closeEditModal();
            message.success('Service has been successfully updated.');
            console.log('put:', result);
            return result.status === 200 ? true : false;
          })
          .catch((err) => {
            return false;
          });
      } else {
        let dataImage = new FormData();
        dataImage.append('files', imageFile);
        await axios
          .post(process.env.REACT_APP_API_URL + '/upload/', dataImage, headers)
          .then((res) => {
            console.log('res', res);
            let imageId = res.data[0];
            axios
              .put(
                `${URLreScrpit}${keyId}`,
                {
                  place_name: `${value['place_name']}`,
                  type: `${value['type']}`,
                  telephone_number: `${value['telephone_number']}`,
                  place_image: imageId,
                  address: `${address}`,
                  latitude: `${latitude}`,
                  longitude: `${longitude}`,
                },
                headers
              )
              .then((result) => {
                fetchData();
                closeEditModal();
                message.success('Service has been successfully updated.');
                console.log('put:', result);
                return result.status === 200 ? true : false;
              })
              .catch((err) => {
                return false;
              });
          })
          .catch((err) => {
            console.log('ERROR', err);
          });
      }
    };

    return (
      <Modal
        visible={visible}
        title="Edit Service"
        footer={[
          <Row justify="end">
            <Button
              style={{
                backgroundColor: '#D8AA81',
                color: '#F5F4EC',
              }}
              className="add-btn"
              key="add"
              onClick={() => {
                console.log('form', form);
                form
                  .validateFields()
                  .then((values) => {
                    if (pickedImage && address !== '') {
                      let newValues = {
                        ...values,
                      };
                      onConfirm(newValues);
                    } else {
                      if (!pickedImage) {
                        setImageBorder('inputNoImageNB');
                      }
                      if (address === '') {
                        console.log('setMapBorder');
                        setMapBorder('mapBorder');
                      }
                    }
                  })
                  .catch((info) => {
                    if (!pickedImage) {
                      setImageBorder('inputNoImageNB');
                    }
                    if (address === '') {
                      console.log('setMapBorder');
                      setMapBorder('mapBorder');
                    }
                    console.log('Validate Failed:', info);
                  });
              }}
            >
              Save
            </Button>
          </Row>,
        ]}
        onCancel={onCancel}
        width={633}
      >
        <Form
          form={form}
          layout="vertical"
          name="form_in_modal"
          initialValues={{
            modifier: 'public',
          }}
          style={{ display: 'flex' }}
        >
          <div style={{ flex: 1 }}>
            <Form.Item
              name="type"
              label="Type"
              rules={[
                {
                  required: true,
                  message: 'Please select type',
                },
              ]}
            >
              <Select style={{ width: '100%' }} onChange={typePicked}>
                {types.map((type, index) =>
                  index > 0 ? (
                    <Option value={type} key={index}>
                      {type}
                    </Option>
                  ) : null
                )}
              </Select>
            </Form.Item>
            <div class="flex-container">
              <Col span={11}>
                <Form.Item
                  name="place_name"
                  label="Shop Name"
                  rules={[
                    {
                      required: true,
                      message: 'Please input shop name',
                    },
                  ]}
                >
                  <Input
                    // defaultValue={editValue.name}
                    placeholder="Please input shop name"
                    style={{ borderRadius: 20 }}
                  />
                </Form.Item>
              </Col>
              <Col span={11}>
                <Form.Item
                  name="telephone_number"
                  label="Tel."
                  rules={[
                    {
                      required: true,
                      message: 'Please input tel.',
                    },
                  ]}
                >
                  <Input
                    // defaultValue={editValue.tel}
                    placeholder="Please input tel."
                    style={{ borderRadius: 20 }}
                  />
                </Form.Item>
              </Col>
            </div>
            <Form.Item
              label={
                <div>
                  <span
                    style={{
                      color: '#ff4d4f',
                      fontSize: 10,
                      position: 'relative',
                      bottom: 5,
                    }}
                  >
                    *{' '}
                  </span>
                  Image
                </div>
              }
            >
              <div>
                {pickedImage ? null : (
                  <div className={imageBorder}>
                    <label htmlFor="input">
                      <div
                        class="child"
                        style={{
                          width: '100%',
                          height: '20vh',
                          textAlign: 'center',
                        }}
                      >
                        <Col>
                          <PictureOutlined
                            style={{
                              width: '100%',
                              fontSize: 64,
                              color: '#818282',
                            }}
                          />
                          Click to this area to upload
                        </Col>
                      </div>
                    </label>
                  </div>
                )}
                <input
                  type="file"
                  id="input"
                  accept="image/*"
                  onChange={selectHandle}
                  onClick={(event) => {
                    event.target.value = null;
                  }}
                  style={{ display: 'none', float: 'left' }}
                />
                {pickedImage ? (
                  <div>
                    <img
                      style={{
                        width: '100%',
                        height: '20vh',
                        borderRadius: 20,
                      }}
                      src={pickedImage}
                      alt="test"
                    />
                  </div>
                ) : null}
                {imageBorder === 'inputNoImageNB' ? (
                  <span style={{ color: '#ff4d4f' }}>Please input details</span>
                ) : null}
                <div style={{ marginTop: 12 }}>
                  {pickedImage ? (
                    <div className="delete">
                      <Button style={{ float: 'right' }} onClick={deleteHandle}>
                        Delete
                      </Button>
                    </div>
                  ) : null}
                </div>
              </div>
            </Form.Item>
            <Form.Item
              label={
                <div>
                  <span
                    style={{
                      color: '#ff4d4f',
                      fontSize: 10,
                      position: 'relative',
                      bottom: 5,
                    }}
                  >
                    *{' '}
                  </span>
                  Map
                </div>
              }
            >
              <SearchMap />

              <div className={mapBorder}>
                <MapWithAMarker
                  googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_KEY}&v=3.exp&libraries=geometry,drawing,places`}
                  loadingElement={<div style={{ height: `100%` }} />}
                  containerElement={<div style={{ height: `40vh` }} />}
                  mapElement={
                    <div style={{ height: `100%`, borderRadius: `20px` }} />
                  }
                />
              </div>
              {mapBorder === 'mapBorder' ? (
                <span style={{ color: '#ff4d4f' }}>Please input address</span>
              ) : null}
            </Form.Item>
          </div>
        </Form>
      </Modal>
    );
  };

  const AddNewService = ({ visible, onCancel }) => {
    const [form] = Form.useForm();
    const [pickedImage, setPickedImage] = useState(null);
    const [latitude, setLatitude] = useState(13.787664624326442);
    const [longitude, setLongitude] = useState(100.48204490167899);
    const [address, setAddress] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [imageBorder, setImageBorder] = useState('inputImageNB');
    const [mapBorder, setMapBorder] = useState('');

    const isFirstRun = useRef(true);
    useEffect(() => {
      if (isFirstRun.current) {
        isFirstRun.current = false;
        return;
      } else {
        if (pickedImage) {
          console.log('inputImageNB');
          setImageBorder('inputImageNB');
        } else {
          console.log('inputNoImageNB');
          setImageBorder('inputNoImageNB');
        }
        if (address === '') {
          console.log('noMap');
          setMapBorder('mapBorder');
        } else {
          console.log('map');
          setMapBorder('');
        }
      }
    }, [pickedImage, address]);

    const deleteHandle = () => {
      setPickedImage(null);
      setImageFile(null);
    };

    const selectHandle = (e) => {
      setImageFile(e.target.files[0]);
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setPickedImage(reader.result);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    };

    const onMarkerDragEnd = async (event) => {
      let newLat = event.latLng.lat();
      let newLng = event.latLng.lng();
      setLatitude(newLat);
      setLongitude(newLng);
      await Geocode.fromLatLng(newLat, newLng).then((response) => {
        console.log('response', response);
        setAddress(response.results[0].formatted_address);
      });
      console.log('newLat', newLat);
      console.log('newLng', newLng);
    };

    function SearchMap() {
      const {
        ready,
        value,
        suggestions: { status, data },
        setValue,
        clearSuggestions,
      } = usePlacesAutocomplete({
        requestOptions: {
          location: {
            lat: () => 13.787664624326442,
            lng: () => 100.48204490167899,
          },
          radius: 200 * 100,
        },
      });

      const [options, setOptions] = useState([]);

      const onSearch = (searchText) => {
        searchText ? setValue(searchText) : clearSuggestions();
      };

      useEffect(() => {
        const arr = [];
        status === 'OK' &&
          data.map(({ description }) => {
            arr.push({ value: description });
          });
        setOptions(arr);
      }, [value]);

      return (
        <AutoComplete
          options={options}
          style={{
            width: '100%',
            borderRadius: 20,
            padding: 4,
            paddingLeft: 20,
            outline: 'none',
            marginBottom: 12,
          }}
          onSelect={async (address) => {
            try {
              console.log('address', address);
              const result = await getGeocode({ address });
              const { lat, lng } = await getLatLng(result[0]);
              console.log('result', result);
              console.log('result_latlng', lat, lng);
              setLatitude(lat);
              setLongitude(lng);
              setAddress(result[0].formatted_address);
            } catch (e) {
              console.log('error!', e);
            }
          }}
          onSearch={onSearch}
          disabled={!ready}
          placeholder="Search by location"
        />
      );
    }

    const MapWithAMarker = withScriptjs(
      withGoogleMap((props) => (
        <GoogleMap
          defaultZoom={18}
          defaultCenter={{ lat: latitude, lng: longitude }}
        >
          <Marker
            draggable={true}
            onDragEnd={onMarkerDragEnd}
            position={{ lat: latitude, lng: longitude }}
          >
            {address ? (
              <InfoWindow>
                <div>{address}</div>
              </InfoWindow>
            ) : null}
          </Marker>
        </GoogleMap>
      ))
    );

    const onConfirm = (newValues) => {
      Modal.confirm({
        title: 'Are you sure you want to add new service?',
        okButtonProps: { shape: 'round', size: 'large', type: 'primary' },
        cancelButtonProps: { shape: 'round', size: 'large' },
        icon: null,
        autoFocusButton: null,
        centered: true,
        onOk() {
          form.resetFields();
          handleOnAdd(newValues);
        },
        onCancel() {
          // onCancel()
        },
      });
    };

    const handleOnAdd = async (value) => {
      let dataImage = new FormData();
      dataImage.append('files', imageFile);
      await axios
        .post(process.env.REACT_APP_API_URL + '/upload/', dataImage, headers)
        .then((res) => {
          console.log('res', res);
          let imageId = res.data[0];
          axios
            .post(
              process.env.REACT_APP_API_URL + '/nearby-recommends',
              {
                place_name: `${value['place_name']}`,
                type: `${value['type']}`,
                telephone_number: `${value['telephone_number']}`,
                place_image: imageId,
                address: `${address}`,
                latitude: `${latitude}`,
                longitude: `${longitude}`,
              },
              headers
            )
            .then((res) => {
              fetchData();
              closeModal();
              message.success('New service has been added successfully.');
            })
            .catch((err) => {
              console.error("Can't add data: ", err);
            });
        })
        .catch((err) => {
          console.log('ERROR', err);
        });
    };

    return (
      <Modal
        visible={visible}
        title="Add New Service"
        footer={[
          <Button
            style={{
              backgroundColor: '#D8AA81',
              color: '#F5F4EC',
            }}
            className="add-btn"
            key="add"
            onClick={() => {
              form
                .validateFields()
                .then((values) => {
                  if (pickedImage && address !== '') {
                    let newValues = {
                      ...values,
                    };
                    onConfirm(newValues);
                  } else {
                    if (!pickedImage) {
                      setImageBorder('inputNoImageNB');
                    }
                    if (address === '') {
                      console.log('setMapBorder');
                      setMapBorder('mapBorder');
                    }
                  }
                })
                .catch((info) => {
                  if (!pickedImage) {
                    setImageBorder('inputNoImageNB');
                  }
                  if (address === '') {
                    console.log('setMapBorder');
                    setMapBorder('mapBorder');
                  }
                  console.log('Validate Failed:', info);
                });
            }}
          >
            Add
          </Button>,
        ]}
        onCancel={onCancel}
        width={633}
      >
        <Form
          form={form}
          layout="vertical"
          name="form_in_modal"
          initialValues={{
            modifier: 'public',
          }}
          style={{ display: 'flex' }}
        >
          <div style={{ flex: 1 }}>
            <Form.Item
              name="type"
              label="Type"
              rules={[
                {
                  required: true,
                  message: 'Please select type',
                },
              ]}
            >
              <Select style={{ width: '100%' }} onChange={typePicked}>
                {types.map((type, index) =>
                  index > 0 ? (
                    <Option value={type} key={index}>
                      {type}
                    </Option>
                  ) : null
                )}
              </Select>
            </Form.Item>
            <div class="flex-container">
              <Col span={11}>
                <Form.Item
                  name="place_name"
                  label="Shop Name"
                  rules={[
                    {
                      required: true,
                      message: 'Please input shop name',
                    },
                  ]}
                >
                  <Input
                    placeholder="Please input shop name"
                    style={{ borderRadius: 20 }}
                  />
                </Form.Item>
              </Col>
              <Col span={11}>
                <Form.Item
                  name="telephone_number"
                  label="Tel."
                  rules={[
                    {
                      required: true,
                      message: 'Please input tel.',
                    },
                  ]}
                >
                  <Input
                    placeholder="Please input tel."
                    style={{ borderRadius: 20 }}
                  />
                </Form.Item>
              </Col>
            </div>
            <Form.Item
              label={
                <div>
                  <span
                    style={{
                      color: '#ff4d4f',
                      fontSize: 10,
                      position: 'relative',
                      bottom: 5,
                    }}
                  >
                    *{' '}
                  </span>
                  Image
                </div>
              }
            >
              <div>
                {pickedImage ? null : (
                  <div className={imageBorder}>
                    <label htmlFor="input">
                      <div
                        class="child"
                        style={{
                          width: '100%',
                          height: '20vh',
                          textAlign: 'center',
                        }}
                      >
                        <Col>
                          <PictureOutlined
                            style={{
                              width: '100%',
                              fontSize: 64,
                              color: '#818282',
                            }}
                          />
                          Click to this area to upload
                        </Col>
                      </div>
                    </label>
                  </div>
                )}
                <input
                  type="file"
                  id="input"
                  accept="image/*"
                  onChange={selectHandle}
                  onClick={(event) => {
                    event.target.value = null;
                  }}
                  style={{ display: 'none', float: 'left' }}
                />
                {pickedImage ? (
                  <div>
                    <img
                      style={{
                        width: '100%',
                        height: '20vh',
                        borderRadius: 20,
                      }}
                      src={pickedImage}
                      alt="test"
                    />
                  </div>
                ) : null}
                {imageBorder === 'inputNoImageNB' ? (
                  <span style={{ color: '#ff4d4f' }}>Please input details</span>
                ) : null}
                <div style={{ marginTop: 12 }}>
                  {pickedImage ? (
                    <div className="delete">
                      <Button style={{ float: 'right' }} onClick={deleteHandle}>
                        Delete
                      </Button>
                    </div>
                  ) : null}
                </div>
              </div>
            </Form.Item>
            <Form.Item
              label={
                <div>
                  <span
                    style={{
                      color: '#ff4d4f',
                      fontSize: 10,
                      position: 'relative',
                      bottom: 5,
                    }}
                  >
                    *{' '}
                  </span>
                  Map
                </div>
              }
            >
              <SearchMap />
              <div className={mapBorder}>
                <MapWithAMarker
                  googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_KEY}&v=3.exp&libraries=geometry,drawing,places`}
                  loadingElement={<div style={{ height: `100%` }} />}
                  containerElement={<div style={{ height: `40vh` }} />}
                  mapElement={
                    <div style={{ height: `100%`, borderRadius: `20px` }} />
                  }
                />
              </div>
              {mapBorder === 'mapBorder' ? (
                <span style={{ color: '#ff4d4f' }}>Please input address</span>
              ) : null}
            </Form.Item>
          </div>
        </Form>
      </Modal>
    );
  };

  const Loading = () => {
    return (
      <div
        style={{
          width: '80vw',
          height: '100vh',
          textAlign: 'center',
          paddingTop: 300,
        }}
      >
        <Spin size="large" />
        <p style={{ color: '#20263A', fontSize: 30 }}>Loading map...</p>
      </div>
    );
  };

  if (loadError) return <Loading />;
  if (!isLoaded) return <Loading />;

  return (
    <>
      <Heading title="Nearby Service" />
      <div className="regis-table">
        <Tabs defaultActiveKey="All Service" onChange={callback}>
          {types.map((type, index) => (
            <TabPane tab={type} key={index} />
          ))}
        </Tabs>
      </div>
      <div className="flex-container">
        <Search
          placeholder="Search by name"
          allowClear
          onSearch={handleSearch}
          style={{ width: 300, marginBottom: 20 }}
          onChange={handleSearchChange}
        />
        <Button
          size="large"
          shape="round"
          icon={<PlusOutlined />}
          style={{
            backgroundColor: '#D8AA81',
            color: '#F5F4EC',
          }}
          onClick={showModal}
        >
          Add New Service
        </Button>
      </div>

      <Table
        columns={columns}
        scroll={{ x: 1200 }}
        dataSource={
          searchTag === 'All Service'
            ? searchName === ''
              ? data
              : data.filter((item) =>
                  item.name.toLowerCase().includes(searchName)
                )
            : data.filter(
                (item) =>
                  item.type.includes(searchTag) &&
                  item.name.toLowerCase().includes(searchName)
              )
        }
      />
      {value != null ? (
        <EditService
          visible={editVisible}
          editValue={value}
          onCancel={closeEditModal}
        />
      ) : null}
      {newVisible ? (
        <AddNewService visible={newVisible} onCancel={closeModal} />
      ) : null}
    </>
  );
}

export default NearbyService;
