import React, { useState, useEffect} from "react";
import {editEMS} from '../../services/API/EmergencyAPI'
import {
  Button,
  Input,
  Modal,
  AutoComplete,
  notification,
  Form,
  Select,
  Col,

} from "antd";
import {
  PlusOutlined,
  PictureOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

import {
  InfoWindow,
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
} from "react-google-maps";

import { useLoadScript } from "@react-google-maps/api";

import axios from "axios";

import Geocode from "react-geocode";
import { useSelector, useDispatch } from "react-redux";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";

const { Option } = Select;
Geocode.setApiKey("AIzaSyC8WtZy4JjxnZlKQEgEQDjgXPqpm5MjXgY");
Geocode.setLanguage("th");
const onMarkerDragEnd = (event) => {
    let newLat = event.latLng.lat();
    let newLng = event.latLng.lng();
    // setLatitude(newLat);
    // setLongitude(newLng);
    Geocode.fromLatLng(newLat, newLng).then((response) => {
      console.log("response", response);
    //   setAddress(response.results[0].formatted_address);
    });
    console.log("newLat", newLat);
    console.log("newLng", newLng);
  };


  const typeEMS=[ { name: "Hospital", status: false, value: "Hospital"},
  { name: "Ambulance", status: false, value: "Ambulance"},
  { name: "Fire Truck", status: false, value: "Fire Truck"},
  { name: "Rescue", status: false, value: "Rescue"},
  { name: "Police", status: false, value: "Police"}]
const EditEMSModal = () => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [latitude, setLatitude] = useState(13.787664624326442);
      const [longitude, setLongitude] = useState(100.48204490167899);
      const [address, setAddress] = useState("");
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const {statusEditEMS,dataEMSEdit } =useSelector((state) => state.EMSActionRedux);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(async () => {
      await form.setFieldsValue({
        typeEMS: dataEMSEdit?.Type,
        ContactName: dataEMSEdit?.Name,
        telephone_number: dataEMSEdit?.Tel,
      });
    await setAddress(dataEMSEdit?.location !==null? dataEMSEdit?.location:null)
    await setLatitude(dataEMSEdit?.Latitude!==null ?parseFloat(dataEMSEdit?.Latitude):null)
    await setLongitude(dataEMSEdit?.Longitude!==null ?parseFloat(dataEMSEdit?.Longitude):null)
      // await setoldFile(dataEdit?.imageprogress);
    }, [dataEMSEdit]);


    
// map

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
function SearchMap(props) {
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
    // setValue(props.AddressMap)
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
      defaultValue={props.AddressMap}
      // value={value}
      //  onChange={(e)=>{setValue(e.target.value)}}
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
    // map
    const OnCancel = async () => {
      await form.setFieldsValue({
        typeEMS: dataEMSEdit?.Type,
        ContactName: dataEMSEdit?.Name,
        telephone_number: dataEMSEdit?.Tel,
      });
      await setAddress(dataEMSEdit?.location !==null? dataEMSEdit?.location:null)
      await setLatitude(dataEMSEdit?.Latitude!==null ?parseFloat(dataEMSEdit?.Latitude):null)
      await setLongitude(dataEMSEdit?.Longitude!==null ?parseFloat(dataEMSEdit?.Longitude):null)
      dispatch({type:"EDIT_EMS"});
    };
    const handleOk = async () => {
        // console.log("ok:", form.getFieldValue());
        await form
            .validateFields()
            .then(async (values) => {
                const allValuesForm = {
                     type:values["typeEMS"],
                     Name:values["ContactName"],
                     Tel:values["telephone_number"],
                     location:address,
                     latitude:latitude,
                     longitude:longitude

                }
                console.log("formValue:", allValuesForm);
                const resultPostData = await editEMS(dataEMSEdit.id,allValuesForm);
                if (resultPostData) {
                    notification["success"]({
                        duration: 2,
                        message: "EditEmergency",
                        description: "Edit emergency successfully.",
                        style: { borderRadius: "25px" },
                    });
                    await  form.resetFields();
                    dispatch({type:"EDIT_EMS"});
                } else {

                    notification["error"]({
                        duration: 2,
                        message: "EditEmergency",
                        description: "Edit emergency failed.",
                        style: { borderRadius: "25px" },
                    });
                }

            })

    };
  return  <Modal
    visible={statusEditEMS}
    title="Edit Service"
    footer={[
      <Button
        style={{
          backgroundColor: "#B2A37A",
          color: "#F5F4EC",
        }}
        className="add-btn"
        key="add"
        onClick={handleOk}
      >
        Edit
      </Button>,
    ]}
     onCancel={OnCancel}
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
                        name={"typeEMS"}
                        label={"type"}
                        rules={[
                            {
                                required: true,
                                message: "select Type",
                            },
                        ]}
                    >

                        <Select
                            showSearch
                            // style={{ width: 200 }}
                            placeholder="select Type"
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                        >
                            {typeEMS.map((e) => {
                                return (
                                    <Option key={e} value={e.value}>
                                        {e.name}
                                    </Option>
                                );
                            })}
                        </Select>
                    </Form.Item>

        <div class="flex-container">
          <Col span={11}>
            <Form.Item
              name="ContactName"
              label="Contact Name"
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
      
        <Form.Item name="map" label="Map">
          <SearchMap AddressMap={address} />
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
}
export default EditEMSModal;