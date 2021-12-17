/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import Heading from "../../../components/Header";
import {
  Button, Table, Image, Input, Row, Col, DatePicker, Form, Modal, Select,
  TimePicker,
} from "antd";
import { PictureOutlined } from "@ant-design/icons";
import axios from "axios";
import moment from "moment";

import { encryptStorage } from "../../../utils/encryptStorage";
const session = encryptStorage.getItem("user_session");

const FixingReports = () => {
  const [data, setData] = useState([]);
  const [visible, setVisible] = useState(false);
  const [searchName, setSearchName] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [reportValue, setReportValue] = useState(null);
  const headers = { headers: { Authorization: "Bearer " + session.jwt } }
  const URLreScript = process.env.REACT_APP_API_URL + "fixing-reports/";
  const { format } = require('date-fns');
  const { Option } = Select;
  const status = { Pending: '#CA0000', Repairing: '#CCCF1F', Success: '#84BA40' };

  const { Search } = Input;

  let columns = [
    {
      title: "No.",
      dataIndex: "number",
      key: "number",
    },
    {
      title: "Address",
      dataIndex: "address_no",
      key: "address_no",
      render: (index, record) => <div>{record.address_no}</div>,
    },
    {
      title: "Owner",
      dataIndex: "owner",
      key: "owner",
      sorter: (a, b) => (a.owner > b.owner ? 1 : -1),
      render: (index, record) => (
        <div>
          {record.owner?.first_name_en} {record.owner?.last_name_en}
        </div>
      ),
    },
    {
      title: "Nationality",
      dataIndex: "nationality",
      key: "nationality",
      sorter: (a, b) => (a.nationality > b.nationality ? 1 : -1),
      render: (index, record) => <div>{record.owner?.nationality}</div>,
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      sorter: (a, b) => (a.type > b.type ? 1 : -1),
      render: (index, record) => <div>{record.project?.type}</div>,
    },
    {
      title: "Tel",
      dataIndex: "tel",
      key: "tel",
      render: (index, record) => <div>{record.owner?.tel}</div>,
    },
    {
      title: "E-Mail",
      dataIndex: "email",
      key: "email",
      sorter: (a, b) => (a.email > b.email ? 1 : -1),
      render: (index, record) => <div>{record.owner?.email}</div>,
    },

  ];

  let extendsColumns = [
    {
      title: "No.",
      dataIndex: "number",
      key: "number",
    },
    {
      title: "Image",
      dataIndex: "image_pending",
      key: "image_pending",
      render: (index, record) => (
        <>
          <Image
            width={150} height={100}
            src={
              record?.image_pending[0]
                ? process.env.REACT_APP_IMG_URL + record.image_pending[0].url
                : "/main/images/artani-logo.png"
            }
          />
        </>
      ),
    },
    {
      width: 120,
      title: "Date",
      dataIndex: "submission_date",
      key: "submission_date",
      render: (text) => {
        const { format } = require('date-fns');
        const today = format(parseInt(text, 10), 'dd MMM yyyy');
        return (
          <span >{today}</span>
        )
      },
    },
    {
      title: "Problem",
      dataIndex: "problem",
      key: "problem",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
    },

    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      hidden: true,
      title: "Address",
      dataIndex: "address_no",
      key: "address_no",
    },
    {
      hidden: true,
      title: "Owner",
      dataIndex: "owner",
      key: "owner",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      sorter: (a, b) => (a.status > b.status ? 1 : -1),
      render: (text) => (
        <>
          <div style={{ color: status[text] }}>{text}</div>
        </>
      ),
    },
    {
      align: "center",
      title: "Action",
      key: "extendsAction",
      render: (_, record) => (
        <Button
          style={{
            backgroundColor: "#B2A37A",
            color: "#F5F4EC",
            borderRadius: 20
          }}
          key="manage_report"
          onClick={() => {
            setVisible(true);
            console.log('record', record);
            handleEdit(record);
          }
          }
        >
          Manage Report
        </Button >
      ),
    },
  ].filter((item) => !item.hidden);

  // function
  const handleEdit = async (record) => {
    setIsEdit(true);
    setReportValue(record);
    setVisible(true);
    console.log('URLreScript', `${URLreScript}${record.key}`)
  };

  const handleSearch = (value) => {
    setSearchName(value.toLowerCase());
  };

  const handleSearchChange = (value) => {
    if (value.target.value === "") {
      setSearchName("");
    }
  };

  const closeModal = () => {
    setVisible(false);
  };

  const ManageReport = ({ visible, reportValue, onCancel }) => {
    const [form] = Form.useForm();
    const [publishPicked, setPublishPicked] = useState();
    const [pickedImage, setPickedImage] = useState(null);
    const [pendingImg, setPendingImg] = useState([]);
    const [repairingImg, setRepairingImg] = useState([]);
    const [successImg, setSuccessImg] = useState([]);
    const [pendingImgFile, setPendingImgFile] = useState([]);
    const [repairingImgFile, setRepairingImgFile] = useState([]);
    const [successImgFile, setSuccessImgFile] = useState([]);
    const [datePicked, setDatePicked] = useState("");
    const [timePicked, setTimePicked] = useState("");
    const { format } = require('date-fns');
    const dateReport = format(parseInt(reportValue.submission_date, 10), 'dd MMM yyyy');

    const handleValue = () => {
      form.setFieldsValue({
        pick_up_date: reportValue.pick_up_date ? moment(format(parseInt(reportValue.pick_up_date, 10), 'yyyy-MM-dd')) : "",
        opening_date: reportValue.opening_date ? moment(format(parseInt(reportValue.opening_date, 10), 'yyyy-MM-dd')) : "",
        closing_date: reportValue.closing_date ? moment(format(parseInt(reportValue.closing_date, 10), 'yyyy-MM-dd')) : "",
        status: reportValue.status,
        cause: reportValue.cause,
        solution: reportValue.solution,
      });
    };

    useEffect(() => {
      handleValue();

      reportValue.opening_date ? console.log('moment reportValue.opening_date', format(parseInt(reportValue.opening_date, 10), 'yyyy-MM-dd')) : console.log('reportValue', reportValue)
    }, []);

    const imagePreviewSty = {
      border: "1px solid #959595",
      borderRadius: '10px',
      margin: '4px',
      width: "16vh",
      height: "16vh"
    };

    function onDateChange(date, dateString) {
      //console.log("date", date);
      //console.log("dateString", dateString);
      setDatePicked(dateString);
    }

    function onTimeChange(time, timeString) {
      //console.log("time", time);
      //console.log("timeString", timeString);
      setTimePicked(timeString);
    }

    const deleteHandle = () => {
      setPickedImage(null);
      setPendingImgFile([]);
      // console.log('preImage', preImage)
    };

    function publishPickedHandle(key) {
      //console.log("publishPickedHandle", key);
      setPublishPicked(key);
    }

    console.log("reportValue", reportValue);
    console.log("image_repairing", reportValue.image_repairing);

    const selectPendingImg = (e) => {
      setPendingImgFile([...pendingImgFile, e.target.files[0]]);
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2 && pendingImg.length < 4) {
          console.log('indexOf', pendingImg.indexOf(reader.result))
          if (pendingImg.indexOf(reader.result) < 0) { setPendingImg([...pendingImg, reader.result]); }
          else { alert('This image is repeated.') }
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    };

    const selectRepairingImg = (e) => {
      setRepairingImgFile([...repairingImgFile, e.target.files[0]]);
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2 && repairingImg.length < 4) {
          console.log('indexOf', repairingImg.indexOf(reader.result))
          if (repairingImg.indexOf(reader.result) < 0) { setRepairingImg([...repairingImg, reader.result]); }
          else { alert('This image is repeated.') }
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    };

    const selectSuccessImg = (e) => {
      setSuccessImgFile([...successImgFile, e.target.files[0]]);
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2 && successImg.length < 4) {
          console.log('indexOf', successImg.indexOf(reader.result))
          if (successImg.indexOf(reader.result) < 0) { setSuccessImg([...successImg, reader.result]); }
          else { alert('This image is repeated.') }
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    };

    const handleOnAdd = async (value) => {
      console.log("value", value);
      var opening_date = new Date(value.opening_date).getTime();
      opening_date ? console.log("newDate", opening_date) : console.log("value.key", reportValue.key);

      axios
        .put(
          `${URLreScript}${reportValue.key}`,
          {

            pick_up_date: value.pick_up_date ? `${new Date(value.pick_up_date).getTime()}` : "",
            opening_date: value.opening_date ? `${new Date(value.opening_date).getTime()}` : "",
            closing_date: value.closing_date ? `${new Date(value.closing_date).getTime()}` : "",
            status: value.status,
            cause: value.cause,
            solution: value.solution,
          },
          headers
        )
        .then((res) => {
          console.log('res', res)
          uploadImg();
          // fetchData();
          // closeModal();
        })
        .catch((err) => {
          console.error("Can't add data: ", err);
        });
    };

    const uploadImg = async () => {
      if (pendingImgFile.length > 0) {
        let arr = [];
        reportValue.image_pending.map(item => (arr.push(item)))
        for (let i = 0; i < pendingImgFile.length; i++) {
          let dataImage = new FormData();
          dataImage.append("files", pendingImgFile[i]);
          console.log('dataImage', dataImage)
          console.log('pendingImgFile', i, pendingImgFile[i])
          dataImage ?
            await axios
              .post(process.env.REACT_APP_API_URL + "upload/", dataImage)
              .then((res) => {
                let imageId = res.data[0];
                console.log("imageId", imageId);
                arr.push(imageId);
                console.log("arr", arr);
                axios
                  .put(
                    `${URLreScript}${reportValue.key}`,
                    {
                      image_pending: arr,

                    },headers
                  )
                  .then((res) => {
                    fetchData();
                    closeModal();
                  })
                  .catch((err) => {
                    console.error("Can't add data: ", err);
                  });
                // }
              })
              .catch((err) => {
                //console.log("ERROR", err);
              }) : alert('noImage')
        }
      }
      if (repairingImgFile.length > 0) {
        let arr = [];
        reportValue.image_repairing.map(item => (arr.push(item)))
        for (let i = 0; i < repairingImgFile.length; i++) {
          let dataImage = new FormData();
          dataImage.append("files", repairingImgFile[i]);
          console.log('dataImage', dataImage)
          console.log('repairingImgFile', i, repairingImgFile[i])
          dataImage ?
            await axios
              .post(process.env.REACT_APP_API_URL + "upload/", dataImage)
              .then((res) => {
                let imageId = res.data[0];
                console.log("imageId", imageId);
                arr.push(imageId);
                console.log("arr", arr);
                axios
                  .put(
                    `${URLreScript}${reportValue.key}`,
                    {
                      image_repairing: arr,

                    },headers
                  )
                  .then((res) => {
                    fetchData();
                    closeModal();
                  })
                  .catch((err) => {
                    console.error("Can't add data: ", err);
                  });
                // }
              })
              .catch((err) => {
                //console.log("ERROR", err);
              }) : alert('noImage')
        }
      }
      if (successImgFile.length > 0) {
        let arr = [];
        reportValue.image_success.map(item => (arr.push(item)))
        for (let i = 0; i < successImgFile.length; i++) {
          let dataImage = new FormData();
          dataImage.append("files", successImgFile[i]);
          console.log('dataImage', dataImage)
          console.log('successImgFile', i, successImgFile[i])
          dataImage ?
            await axios
              .post(process.env.REACT_APP_API_URL + "upload/", dataImage)
              .then((res) => {
                let imageId = res.data[0];
                console.log("imageId", imageId);
                arr.push(imageId);
                console.log("arr", arr);
                axios
                  .put(
                    `${URLreScript}${reportValue.key}`,
                    {
                      image_success: arr,

                    },headers
                  )
                  .then((res) => {
                    fetchData();
                    closeModal();
                  })
                  .catch((err) => {
                    console.error("Can't add data: ", err);
                  });
                // }
              })
              .catch((err) => {
                //console.log("ERROR", err);
              }) : alert('noImage')
        }
      }

    }

    const PendingImages = () => {
      return <Row>
        {reportValue.image_pending.map((item, index) => {
          return <Image
            style={imagePreviewSty}
            src={process.env.REACT_APP_IMG_URL + item.url}
            alt={"reportPendingImg" + index}
          />
        })}
        {pendingImg.map((item, index) => {
          return <Image
            style={imagePreviewSty}
            src={item}
            alt={"pendingImg" + index}
          />
        })}
        {(reportValue.image_pending.length + pendingImg.length < 3) ?
          <div className="inputReportImage">
            <label htmlFor="inputPending">
              <div
                class="child"
                style={{
                  width: "16vh",
                  height: "16vh",
                  textAlign: "center",
                  fontSize: 10,
                }}
              >
                <Col>
                  <PictureOutlined
                    style={{
                      width: "16vh",
                      height: "20px",
                      fontSize: 32,
                      color: "#818282",
                    }}
                  />
                  Click to this area to upload
                </Col>
              </div>
            </label>
          </div> : null
        }
      </Row >
    }

    const RepairingImages = () => {
      return <Row>
        {reportValue.image_repairing.map((item, index) => {
          return <Image
            style={imagePreviewSty}
            src={process.env.REACT_APP_IMG_URL + item.url}
            alt={"reportRepairingImg" + index}
          />
        })}
        {repairingImg.map((item, index) => {
          return <Image
            style={imagePreviewSty}
            src={item}
            alt={"repairingImg" + index}
          />
        })}
        {(reportValue.image_repairing.length + repairingImg.length < 3) ?
          <div className="inputReportImage">
            <label htmlFor="inputRepairing">
              <div
                class="child"
                style={{
                  width: "16vh",
                  height: "16vh",
                  textAlign: "center",
                  fontSize: 10,
                }}
              >
                <Col>
                  <PictureOutlined
                    style={{
                      width: "16vh",
                      height: "20px",
                      fontSize: 32,
                      color: "#818282",
                    }}
                  />
                  Click to this area to upload
                </Col>
              </div>
            </label>
          </div> : null
        }
      </Row >
    }

    const SuccessImages = () => {
      return <Row>
        {reportValue.image_success.map((item, index) => {
          return <Image
            style={imagePreviewSty}
            src={process.env.REACT_APP_IMG_URL + item.url}
            alt={"reportSuccessImg" + index}
          />
        })}
        {successImg.map((item, index) => {
          return <Image
            style={imagePreviewSty}
            src={item}
            alt={"successImg" + index}
          />
        })}
        {(reportValue.image_success.length + successImg.length < 3) ?
          <div className="inputReportImage">
            <label htmlFor="inputSuccess">
              <div
                class="child"
                style={{
                  width: "16vh",
                  height: "16vh",
                  textAlign: "center",
                  fontSize: 10,
                }}
              >
                <Col>
                  <PictureOutlined
                    style={{
                      width: "16vh",
                      height: "20px",
                      fontSize: 32,
                      color: "#818282",
                    }}
                  />
                  Click to this area to upload
                </Col>
              </div>
            </label>
          </div> : null
        }
      </Row >

    }

    return (
      <Modal
        visible={visible}
        title="Manage Report"
        footer={[
          <Button
            style={{
              backgroundColor: "#B2A37A",
              color: "#F5F4EC",
            }}
            className="add-btn"
            key="add"
            onClick={() => uploadImg()}
          >
            Cancel
          </Button>,
          <Button
            style={{
              backgroundColor: "#B2A37A",
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
                  //console.log("Validate Failed:", info);
                });
            }}
          >
            OK
          </Button>,
        ]}
        onCancel={onCancel}
        width={'70%'}
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
              label="Owner"
            >
              <div className='divText'

              ><p className='disableText'>{reportValue.owner}</p></div>
            </Form.Item>
            <Form.Item
              label="วันที่ส่งเรื่อง"
              name="submission_date"
            >
              <div className='divText'

              ><p className='disableText'>{dateReport}</p></div>
            </Form.Item>
            <Form.Item
              name="opening_date"
              label="วันเปิดใบงาน"
            >
              <DatePicker className="dateTime" onChange={onDateChange} />
            </Form.Item>
            <Form.Item
              name="status"
              label="Status"
              rules={[
                {
                  required: true,
                  message: "Please select type",
                },
              ]}
            >
              <Select style={{ width: "100%" }}>
                {Object.keys(status).map((type, index) => (
                  <Option value={type} key={index}>
                    {type}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              label="Problem"
            >
              <div className='divText'

              ><p className='disableText'>{reportValue.problem}</p></div>
            </Form.Item>
            <Form.Item label="Pending">
              <input
                type="file"
                id="inputPending"
                accept="image/*"
                onChange={selectPendingImg}
                onClick={(event) => {
                  event.target.value = null;
                }}
                style={{ display: "none", float: "left" }}
              />
              <PendingImages />
            </Form.Item>
            <Form.Item label="Repairing">
              <input
                type="file"
                id="inputRepairing"
                accept="image/*"
                onChange={selectRepairingImg}
                onClick={(event) => {
                  event.target.value = null;
                }}
                style={{ display: "none", float: "left" }}
              />
              <RepairingImages />
            </Form.Item>
            <Form.Item label="Success">
              <input
                type="file"
                id="inputSuccess"
                accept="image/*"
                onChange={selectSuccessImg}
                onClick={(event) => {
                  event.target.value = null;
                }}
                style={{ display: "none", float: "left" }}
              />
              <SuccessImages />
            </Form.Item>
          </div>
          <div style={{ width: 45 }}></div>
          <div style={{ flex: 1 }}>
            <Form.Item
              label="Address"
            >
              <div className='divText'
              ><p className='disableText'>{reportValue.address_no}</p></div>
            </Form.Item>
            <Form.Item
              name="pick_up_date"
              label="วันที่รับเรื่อง"
            >
              <DatePicker className="dateTime" onChange={onDateChange} />
            </Form.Item>
            <Form.Item
              name="closing_date"
              label="วันปิดใบงาน"
            >
              <DatePicker className="dateTime" onChange={onDateChange} />
            </Form.Item>
            <Form.Item
              label="Type"
            >
              <div className='divText'

              ><p className='disableText'>{reportValue.type}</p></div>
            </Form.Item>
            <Form.Item
              label="Description"
            >
              <div className='divArea'
              ><p className='disableText'>{reportValue.description}</p>
              </div>
            </Form.Item>
            <Form.Item
              name="cause"
              label="Cause"
            >
              <Input.TextArea
                placeholder="Please input details"
                style={{ padding: '8px', borderRadius: '30px', minHeight: "20vh" }}
              />
            </Form.Item>
            <Form.Item
              name="solution"
              label="Solution"
            >
              <Input.TextArea
                placeholder="Please input details"
                style={{ padding: '8px', borderRadius: '30px', minHeight: "20vh" }}
              />
            </Form.Item>
            {publishPicked === "Scheduled" ? (
              <div className="flex-container">
                <div style={{ flex: 1 }}>
                  <Form.Item
                    name="date"
                    label="Date"
                    rules={[
                      {
                        type: "date",
                        required: true,
                        message: "Please select date",
                      },
                    ]}
                  >
                    <DatePicker className="dateTime" onChange={onDateChange} />
                  </Form.Item>
                </div>
                <div style={{ width: 10 }}></div>
                <div style={{ flex: 1 }}>
                  <Form.Item
                    name="time"
                    label="Time"
                    rules={[
                      {
                        type: "object",
                        required: true,
                        message: "Please select time",
                      },
                    ]}
                  >
                    <TimePicker
                      className="dateTime"
                      onChange={onTimeChange}
                      format="HH:mm"
                    />
                  </Form.Item>
                </div>
              </div>
            ) : null}
          </div>
        </Form>
      </Modal >
    );
  };

  const fetchData = async () => {
    let residencesData = [];
    let combinesData = [];

    await axios
      .get(process.env.REACT_APP_API_URL + "/addresses",headers)
      .then((res) => {
        console.log('resData',res.data)
        residencesData = res.data;
        residencesData
          .filter((item) => item.owner != null && item.owner !== undefined)
          .forEach((residence, index) => {
            let residenceData = { key: index, number: index + 1, ...residence };
            residence.fixing_reports.forEach((report, index) => {
              let newReport = { key: residence.fixing_reports[index].id, number: index + 1, address_no: residence.address_no, owner: (residence.owner.first_name_en + ' ' + residence.owner.last_name_en), ...report };
              residence.fixing_reports[index] = newReport;
            });
            console.log('residenceData');
            console.log(residenceData.fixing_reports);
            combinesData.push(residenceData);
          });
      });
    setData(combinesData);
    //console.log('combinesData');
    //console.log(combinesData);
  };

  // set data
  useEffect(() => {
    fetchData();
    console.log("session", session);
  }, []);

  return (
    <>
      <Heading title="Fixing Reports" />

      <Search
        placeholder="Search by name"
        allowClear
        onSearch={handleSearch}
        style={{ width: 200, marginBottom: 19, marginTop: 10 }}
        onChange={handleSearchChange}
        className="search-box"
      />
      <Table
        columns={columns}
        className="tableContainer"
        expandable={{
          expandedRowRender: (record) => (
            <Table
              columns={extendsColumns}
              dataSource={record?.fixing_reports}
              pagination={false}
              rowClassName="expand-table"
            />
          ),
          rowExpandable: (record) => record.fixing_reports != null,
        }}
        dataSource={
          searchName === ""
            ? data
            : data.filter((item) =>
              item.owner.first_name_en.toLowerCase().includes(searchName) ||
              item.owner.last_name_en.toLowerCase().includes(searchName)
            )
        }

      />
      {visible ? (
        <ManageReport
          visible={visible}
          reportValue={reportValue}
          onCancel={() => {
            setVisible(false);
          }}
        />
      ) : null}
    </>
  );
};

export default FixingReports;
