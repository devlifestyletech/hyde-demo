/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, memo } from "react";
import Heading from "../../components/Header";
import {
  Tabs,
  Button,
  Table,
  Image,
  Input,
  Modal,
  Popconfirm,
  AutoComplete,
  Form,
  Select,
  Col,
  Row,
  Divider,
  Spin
} from "antd";
import {
  PlusOutlined,
  PictureOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

import editIcon from "./assets/icons/edit.svg";
import trashIcon from "./assets/icons/trash.svg";
import noImg from "./assets/images/noImg.jpg";

import "./style/nearbyStyle.css";

import axios from "axios";

import {
  InfoWindow,
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
} from "react-google-maps";

import Geocode from "react-geocode";

import { useLoadScript } from "@react-google-maps/api";

import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";


import { encryptStorage } from "../../utils/encryptStorage";
const session = encryptStorage.getItem("user_session");

Geocode.setApiKey(process.env.REACT_APP_GOOGLE_MAPS_KEY);
Geocode.setLanguage("th");
const libraries = ["places"];

function NearbyService() {
  const URLreScrpit = process.env.REACT_APP_API_URL + "/nearby-recommends/";
  const headers = { headers: { Authorization: "Bearer " + session.jwt }, }
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_KEY,
    libraries,
  });

  const types = [
    "All Service",
    "Shop",
    "Plumber",
    "Electronics",
    "Moving",
    "Laundry",
    "Cafe",
    "Restaurant",
  ];
  const { TabPane } = Tabs;
  const { Search } = Input;
  const { Option } = Select;
  const [data, setData] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [searchTag, setSearchTag] = useState("");
  const [value, setValue] = useState(null);
  const [newVisible, setNewVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);

  useEffect(() => {
    console.log('session.jwt', session.jwt)
    fetchData();
  }, []);

  let columns = [
    {
      title: "No.",
      dataIndex: "number",
      key: "number",
    },
    {
      title: "Picture",
      dataIndex: "picture",
      key: "picture",
      render: (text) => (
        <>
          <Image width={300} height={200} src={text} />
        </>
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => (a.name > b.name ? 1 : -1),
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
      sorter: (a, b) => (a.location > b.location ? 1 : -1),
    },
    {
      title: "Tel",
      dataIndex: "tel",
      key: "tel",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      sorter: (a, b) => (a.type > b.type ? 1 : -1),
    },
    {
      width: 100,
      title: "operation",
      dataIndex: "operation",
      render: (_, record) => (
        <Row justify="space-between">
          <Col>
            <Popconfirm
              icon={<EditOutlined />}
              title="Sure to Edit?"
              onConfirm={() => handleEdit(record)}
            >
              <img src={editIcon} alt="Edit" />
            </Popconfirm>
          </Col>
          <Col>
            <Divider type='vertical' style={{ height: 30 }} />
          </Col>
          <Col>
            <Popconfirm
              icon={<DeleteOutlined style={{ color: "red" }} />}
              title="Sure to delete?"
              onConfirm={() => handleDelete(record.key)}
            >
              <img src={trashIcon} alt="Trash" />
            </Popconfirm>
          </Col>
        </Row>
      ),
    },
  ];

  const fetchData = () => {
    axios
      // .get('http://54.179.47.77:1337/nearby-recommends',
      .get(URLreScrpit,
        headers
      )
      .then((response) => {
        console.log("data", response.data);
        let originData = [];

        response.data.map((item, idx) => {
          // console.log("place_image", item);
          return originData.push({
            key: item["id"] + "," + item["latitude"] + "," + item["longitude"],
            number: idx + 1,
            picture:
              item["place_image"].length > 0
                ? `${process.env.REACT_APP_IMG_URL}${item["place_image"][0]["url"]}`
                : noImg,
            name: item["place_name"],
            location: item["address"],
            tel: item["telephone_number"],
            type: item["type"],
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
    setSearchName("");
  };

  const typePicked = (key) => {
    console.log(key);
  };

  const handleSearch = (value) => {
    setSearchName(value.toLowerCase());
  };

  const handleSearchChange = (value) => {
    if (value.target.value === "") {
      setSearchName("");
    }
  };

  const handleEdit = async (record) => {
    console.log("Edit", record);
    setValue(record);
    showEditModal();
  };

  const handleDelete = async (key) => {
    console.log("record.name", key.split(",")[0]);
    const keyId = key.split(",")[0];
    await axios
      .delete(`${URLreScrpit}${keyId}`, headers)
      .then((result) => {
        fetchData();
        console.log("delete:", result);
        return result.status === 200 ? true : false;
      })
      .catch((err) => {
        return false;
      });
  };

  const EditService = ({ visible, editValue, onCancel }) => {
    console.log("rerender modal");
    const keyId = editValue.key.split(",")[0];
    const [form] = Form.useForm();
    const [pickedImage, setPickedImage] = useState(editValue.picture);
    const [latitude, setLatitude] = useState(
      parseFloat(editValue.key.split(",")[1])
    );
    const [longitude, setLongitude] = useState(
      parseFloat(editValue.key.split(",")[2])
    );
    const [address, setAddress] = useState(editValue.location);
    const [imageFile, setImageFile] = useState(null);
    console.log("value", imageFile);

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
        console.log("MAPresponse", response);
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
      console.log("dataMAp", data);

      const [options, setOptions] = useState([]);

      const onSearch = (searchText) => {
        searchText ? setValue(searchText) : clearSuggestions();
      };

      useEffect(() => {
        const arr = [];
        status === "OK" &&
          data.map(({ description }) => {
            arr.push({ value: description });
          });
        setOptions(arr);
      }, [value]);



      return (
        <AutoComplete
          options={options}
          style={{
            width: "100%",
            borderRadius: 20,
            padding: 4,
            paddingLeft: 20,
            outline: "none",
            marginBottom: 12,
          }}
          onSelect={async (address) => {
            try {
              console.log("address", address);
              const result = await getGeocode({ address });
              const { lat, lng } = await getLatLng(result[0]);
              console.log("result", result);
              console.log("result_latlng", lat, lng);
              setLatitude(lat);
              setLongitude(lng);
              setAddress(result[0].formatted_address);
            } catch (e) {
              console.log("error!", e);
            }
          }}
          onSearch={onSearch}
          disabled={!ready}
          placeholder="Search by location"
        />
      );
    }

    const handleEditChange = async (value) => {
      if (imageFile == null) {
        console.log("no Img");
        await axios
          .put(
            `${URLreScrpit}${keyId}`,
            {
              place_name: `${value["place_name"]}`,
              type: `${value["type"]}`,
              telephone_number: `${value["telephone_number"]}`,
              address: `${address}`,
              latitude: `${latitude}`,
              longitude: `${longitude}`,
            }, headers
          )
          .then((result) => {
            fetchData();
            closeEditModal();
            console.log("put:", result);
            return result.status === 200 ? true : false;
          })
          .catch((err) => {
            return false;
          });
      } else {
        let dataImage = new FormData();
        dataImage.append("files", imageFile);
        await axios
          .post(process.env.REACT_APP_API_URL + "upload/", dataImage)
          .then((res) => {
            console.log("res", res);
            let imageId = res.data[0];
            axios
              .put(
                `${URLreScrpit}${keyId}`,
                {
                  place_name: `${value["place_name"]}`,
                  type: `${value["type"]}`,
                  telephone_number: `${value["telephone_number"]}`,
                  place_image: imageId,
                  address: `${address}`,
                  latitude: `${latitude}`,
                  longitude: `${longitude}`,
                }, headers
              )
              .then((result) => {
                fetchData();
                closeEditModal();
                console.log("put:", result);
                return result.status === 200 ? true : false;
              })
              .catch((err) => {
                return false;
              });
          })
          .catch((err) => {
            console.log("ERROR", err);
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
                backgroundColor: "#D8AA81",
                color: "#F5F4EC",
              }}
              className="add-btn"
              onClick={() => {
                closeEditModal();
              }}
            >
              Close
            </Button>
            <Button
              style={{
                backgroundColor: "#D8AA81",
                color: "#F5F4EC",
              }}
              className="add-btn"
              key="add"
              onClick={() => {
                console.log("form", form);
                form
                  .validateFields()
                  .then((values) => {
                    let newValues = {
                      ...values,
                    };
                    form.resetFields();
                    handleEditChange(newValues);
                  })
                  .catch((info) => {
                    console.log("Validate Failed:", info);
                  });
              }}
            >
              Edit
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
            modifier: "public",
          }}
          style={{ display: "flex" }}
        >
          <div style={{ flex: 1 }}>
            <Form.Item
              name="type"
              label="Type"
              rules={[
                {
                  required: true,
                  message: "Please select type",
                },
              ]}
            >
              <Select style={{ width: "100%" }} onChange={typePicked}>
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
                      message: "Please input shop name",
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
                      message: "Please input tel.",
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
            <Form.Item label="Image">
              <div>
                {pickedImage ? (
                  <div>
                    <img
                      style={{ width: "100%", height: "50vh" }}
                      src={pickedImage}
                      alt="test"
                    />
                  </div>
                ) : (
                  <div className="nearbyInputImage">
                    <label htmlFor="input">
                      <div
                        class="nearbyChild"
                        style={{
                          width: "100%",
                          height: "20vh",
                          textAlign: "center",
                        }}
                      >
                        <Col>
                          <PictureOutlined
                            style={{
                              width: "100%",
                              fontSize: 64,
                              color: "#818282",
                            }}
                          />
                          Click file to this area to upload
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
                  style={{ display: "none", float: "left" }}
                />
                <div style={{ marginTop: 12 }}>
                  {pickedImage ? (
                    <div className="delete">
                      <Button style={{ float: "right" }} onClick={deleteHandle}>
                        Delete
                      </Button>
                    </div>
                  ) : null}
                </div>
              </div>
            </Form.Item>
            <Form.Item name="map" label="Map">
              <SearchMap />
              <MapWithAMarker
                googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyAQW30GN_VJgAAoZxI6cKJCfQkOypYP4nI&v=3.exp&libraries=geometry,drawing,places"
                loadingElement={<div style={{ height: `100%` }} />}
                containerElement={<div style={{ height: `250px` }} />}
                mapElement={<div style={{ height: `100%` }} />}
              />
            </Form.Item>
          </div>
        </Form>
      </Modal>
    );
  };

  const AddNewService = memo(({ visible, onCancel }) => {
    console.log("rerender modal");
    const [form] = Form.useForm();
    const [pickedImage, setPickedImage] = useState(null);
    const [latitude, setLatitude] = useState(13.787664624326442);
    const [longitude, setLongitude] = useState(100.48204490167899);
    const [address, setAddress] = useState("");
    const [imageFile, setImageFile] = useState(null);

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
        console.log("response", response);
        setAddress(response.results[0].formatted_address);
      });
      console.log("newLat", newLat);
      console.log("newLng", newLng);
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
      // console.log("dataMAp", data);

      const [options, setOptions] = useState([]);

      const onSearch = (searchText) => {
        searchText ? setValue(searchText) : clearSuggestions();
      };

      useEffect(() => {
        const arr = [];
        status === "OK" &&
          data.map(({ description }) => {
            arr.push({ value: description });
          });
        setOptions(arr);
      }, [value]);

      return (
        <AutoComplete
          options={options}
          style={{
            width: "100%",
            borderRadius: 20,
            padding: 4,
            paddingLeft: 20,
            outline: "none",
            marginBottom: 12,
          }}
          onSelect={async (address) => {
            try {
              console.log("address", address);
              const result = await getGeocode({ address });
              const { lat, lng } = await getLatLng(result[0]);
              console.log("result", result);
              console.log("result_latlng", lat, lng);
              setLatitude(lat);
              setLongitude(lng);
              setAddress(result[0].formatted_address);
            } catch (e) {
              console.log("error!", e);
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

    const handleTest = async () => {
      let dataImage = new FormData();
      dataImage.append("files", imageFile);
      await axios
        .post(process.env.REACT_APP_API_URL + "/upload/", dataImage, headers).then((res) => {
          console.log("handleTest", res)
        }).catch((err) => {
          console.log("ERROR", err);
        });
    };

    const handleOnAdd = async (value) => {
      let dataImage = new FormData();
      dataImage.append("files", imageFile);
      await axios
        .post(process.env.REACT_APP_API_URL + "upload/", dataImage)
        .then((res) => {
          console.log("res", res);
          let imageId = res.data[0];
          axios
            .post(
              process.env.REACT_APP_API_URL + "/nearby-recommends",
              {
                place_name: `${value["place_name"]}`,
                type: `${value["type"]}`,
                telephone_number: `${value["telephone_number"]}`,
                place_image: imageId,
                address: `${address}`,
                latitude: `${latitude}`,
                longitude: `${longitude}`,
              }, headers
            )
            .then((res) => {
              fetchData();
              closeModal();
            })
            .catch((err) => {
              console.error("Can't add data: ", err);
            });
        })
        .catch((err) => {
          console.log("ERROR", err);
        });
    };

    return (
      <Modal
        visible={visible}
        title="Add New Service"
        footer={[
          <Button
            style={{
              backgroundColor: "#D8AA81",
              color: "#F5F4EC",
            }}
            className="add-btn"
            key="add"
            onClick={() => {
              form
                .validateFields()
                .then((values) => {
                  let newValues = {
                    ...values,
                  };
                  form.resetFields();
                  handleOnAdd(newValues);
                })
                .catch((info) => {
                  console.log("Validate Failed:", info);
                });
            }}
          >
            Add
          </Button>,
          <Button
            style={{
              backgroundColor: "#D8AA81",
              color: "#F5F4EC",
            }}
            className="add-btn"
            key="add"
            onClick={() => {
              handleTest()
            }}
          >
            test
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
            modifier: "public",
          }}
          style={{ display: "flex" }}
        >
          <div style={{ flex: 1 }}>
            <Form.Item
              name="type"
              label="Type"
              rules={[
                {
                  required: true,
                  message: "Please select type",
                },
              ]}
            >
              <Select style={{ width: "100%" }} onChange={typePicked}>
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
                      message: "Please input shop name",
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
                      message: "Please input tel.",
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
            <Form.Item label="Image">
              <div>
                {pickedImage ? (
                  <div>
                    <img
                      style={{ width: "100%", height: "50vh" }}
                      src={pickedImage}
                      alt="test"
                    />
                  </div>
                ) : (
                  <div className="nearbyInputImage">
                    <label htmlFor="input">
                      <div
                        class="child"
                        style={{
                          width: "100%",
                          height: "20vh",
                          textAlign: "center",
                        }}
                      >
                        <Col>
                          <PictureOutlined
                            style={{
                              width: "100%",
                              fontSize: 64,
                              color: "#818282",
                            }}
                          />
                          Click file to this area to upload
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
                  style={{ display: "none", float: "left" }}
                />
                <div style={{ marginTop: 12 }}>
                  {pickedImage ? (
                    <div className="delete">
                      <Button style={{ float: "right" }} onClick={deleteHandle}>
                        Delete
                      </Button>
                    </div>
                  ) : null}
                </div>
              </div>
            </Form.Item>
            <Form.Item name="map" label="Map">
              <SearchMap />
              <MapWithAMarker
                googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyAQW30GN_VJgAAoZxI6cKJCfQkOypYP4nI&v=3.exp&libraries=geometry,drawing,places"
                loadingElement={<div style={{ height: `100%` }} />}
                containerElement={<div style={{ height: `250px` }} />}
                mapElement={<div style={{ height: `100%` }} />}
              />
            </Form.Item>
          </div>
        </Form>
      </Modal>
    );
  });

  const Loading = () => {
    return <div style={{ width: "80vw", height: "100vh", textAlign: "center", paddingTop: 300 }}>
      <Spin size='large' />
      <p style={{ color: "#20263A", fontSize: 30 }}>Loading map...</p>
    </div>
  }

  if (loadError) return <Loading />;
  if (!isLoaded) return <Loading />;

  return (
    <>
      <Heading title="Nearby Service" />
      <div align="right">
        <Button
          size="large"
          shape="round"
          icon={<PlusOutlined />}
          style={{
            marginTop: 10,
            backgroundColor: "#D8AA81",
            color: "#F5F4EC",
            alignSelf: "end",
          }}
          onClick={showModal}
        >
          Add New Service
        </Button>
      </div>
      <div className='regis-table'>
        <Tabs defaultActiveKey="All Service" onChange={callback}>
          {types.map((type, index) => (
            <TabPane tab={type} key={index} />
          ))}
        </Tabs></div>
      <Search
        placeholder="Search by name"
        allowClear
        onSearch={handleSearch}
        style={{ width: 200, marginBottom: 19 }}
        onChange={handleSearchChange}
        className="search-box"
      />
      <Table
        columns={columns}
        dataSource={
          searchTag === "All Service"
            ? searchName === ""
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
        <AddNewService
          visible={newVisible}
          // onAdd={handleOnAdd}
          onCancel={closeModal}
        />
      ) : null}
    </>
  );
}

export default NearbyService;
