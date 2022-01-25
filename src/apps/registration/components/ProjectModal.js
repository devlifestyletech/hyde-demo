import React, { useState, useEffect } from "react";
import {
  Form,
  Modal,
  Button,
  Row,
  Col,
  Input,
  Radio,
  AutoComplete,
} from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import imgIcon from "../assets/icons/edit.svg";
import {
  InfoWindow,
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
} from "react-google-maps";

import Geocode from "react-geocode";

import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import projectService from "../services/project.service";
Geocode.setApiKey(process.env.REACT_APP_GOOGLE_MAPS_KEY);
Geocode.setLanguage("th");

export default function ProjectModal({ visible, onCancel }) {
  const [typeOfProject, setTypeOfProject] = useState("House");
  const [imageFile, setImageFile] = useState(null);
  const [pickedImage, setPickedImage] = useState(null);
  const [latitude, setLatitude] = useState(13.787664624326442);
  const [longitude, setLongitude] = useState(100.48204490167899);
  const [address, setAddress] = useState("");

  useEffect(() => {}, []);

  const [form] = Form.useForm();

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

  const onMarkerDragEnd = (event) => {
    let newLat = event.latLng.lat();
    let newLng = event.latLng.lng();
    setLatitude(newLat);
    setLongitude(newLng);
    Geocode.fromLatLng(newLat, newLng).then((response) => {
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

    const [options, setOptions] = useState([]);

    const onSearch = (searchText) => {
      searchText ? setValue(searchText) : clearSuggestions();
    };

    useEffect(() => {
      const arr = [];
      status === "OK" &&
        data.forEach(({ description }) => {
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
  return (
    <Modal
      className="createProjectModal"
      title="Create Project"
      centered
      visible={visible}
      onCancel={() => onCancel()}
      footer={[
        <Button key="cancel" shape="round" onClick={() => onCancel()}>
          Cancel
        </Button>,
        <Button
          key="submit"
          shape="round"
          onClick={(e) => {
            e.preventDefault();
            form.validateFields().then((value) => {
              let newValue = {
                latitude: latitude,
                longitude: longitude,
                ...value,
              };
              console.log(newValue);
              projectService.createProject(newValue).then(() => {
                onCancel();
              });
            });
          }}
        >
          Create Project
        </Button>,
      ]}
      width={1000}
    >
      <Form form={form} layout="vertical">
        <Row>
          <Col span="12" className="split">
            <Form.Item
              label="Project name"
              name="project_name"
              rules={[
                {
                  required: true,
                  message: "Please input your project name!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Address number"
              name="address_no"
              rules={[
                {
                  required: true,
                  message: "Please input your address number!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Soi name"
              name="soi"
              rules={[
                {
                  required: true,
                  message: "Please input your address number!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Road"
              name="road"
              rules={[
                {
                  required: true,
                  message: "Please input your road name!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Sub-District"
              name="sub_district"
              rules={[
                {
                  required: true,
                  message: "Please select your sub district!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="District"
              name="district"
              rules={[
                {
                  required: true,
                  message: "Please select your district!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Province"
              name="province"
              rules={[
                {
                  required: true,
                  message: "Please input your username!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Postal code"
              name="zip_code"
              rules={[
                {
                  required: true,
                  message: "Please input your username!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Phone Number"
              name="tel"
              rules={[
                {
                  required: true,
                  message: "Please input your username!",
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span="12" className="split">
            <Form.Item
              label="Email Contact"
              name="email"
              rules={[
                {
                  required: true,
                  message: "Please input your username!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item label="Type of Project" name="type" defaultValue="House">
              <Radio.Group
                defaultValue={typeOfProject}
                onChange={(e) => setTypeOfProject(e.target.value)}
                buttonStyle="solid"
              >
                <Radio.Button value="House">House</Radio.Button>
                <Radio.Button value="Condominium">Condominium</Radio.Button>
              </Radio.Group>
            </Form.Item>
            <Form.Item label="Image">
              <div>
                {pickedImage ? null : (
                  <div className="avatar">
                    <label htmlFor="input">
                      <img src={imgIcon} alt="upload" className="img-upload" />
                      <p>Click to upload image</p>
                    </label>
                  </div>
                )}
                <input
                  type="file"
                  id="input"
                  accept="image/*"
                  onChange={selectImage}
                  onClick={(event) => {
                    event.target.value = null;
                  }}
                  style={{
                    display: "none",
                    float: "left",
                  }}
                />
                {pickedImage ? (
                  <div>
                    <img className="avatar" src={pickedImage} alt="picked" />
                  </div>
                ) : null}
                <div>
                  {pickedImage ? (
                    <div className="delete">
                      <Button
                        style={{
                          float: "right",
                        }}
                        onClick={() => {
                          setPickedImage(null);
                          setImageFile(null);
                        }}
                      >
                        <DeleteOutlined /> Delete
                      </Button>
                    </div>
                  ) : null}
                </div>
              </div>
            </Form.Item>
            <Form.Item label="Location">
              <SearchMap />
              <MapWithAMarker
                googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyAQW30GN_VJgAAoZxI6cKJCfQkOypYP4nI&v=3.exp&libraries=geometry,drawing,places"
                loadingElement={<div style={{ height: `100%` }} />}
                containerElement={<div style={{ height: `250px` }} />}
                mapElement={<div style={{ height: `100%` }} />}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}
