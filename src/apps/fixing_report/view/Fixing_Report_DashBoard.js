/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import Heading from "../../components/Heading";
import { Row, Col, Card, Table, DatePicker, Button } from "antd";
import { SettingOutlined } from "@ant-design/icons";
import { Pie, G2 } from "@ant-design/charts";
import "../style/fixingStyle.css";
import axios from "axios";
import moment from "moment";

import { encryptStorage } from "../../utils/encryptStorage";
const session = encryptStorage.getItem("user_session");

export default function FixingReportDashBoard() {
  const [fixingData, setFixingData] = useState([]);
  const [todayData, setTodayData] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const day = new Date().setHours(0, 0, 0, 0);
  const [monthData, setMonthData] = useState([]);

  const { registerTheme } = G2;
  registerTheme('custom-theme', {
    colors10: [
      '#ED1C24',
      '#DDE03D',
      '#84BA40',
    ],
  });

  let data = [
    {
      type: "Pending",
      value:
        fixingData.filter((item) => item.status === "Pending").length || 0,
    },
    {
      type: "Repairing",
      value: fixingData.filter((item) => item.status === "Repairing").length || 0,
    },
    {
      type: "Success",
      value:
        fixingData.filter((item) => item.status === "Success").length || 0,
    },
  ];
  let dataToday = [
    {
      type: "Pending",
      value:
        todayData.filter((item) => item.status === "Pending").length || 0,
    },
    {
      type: "Repairing",
      value: todayData.filter((item) => item.status === "Repairing").length || 0,
    },
    {
      type: "Success",
      value:
        todayData.filter((item) => item.status === "Success").length || 0,
    },
  ];

  let configPieChart = {
    appendPadding: 10,
    data: data,
    angleField: "value",
    colorField: "type",
    radius: 0.9,
    label: {
      type: "inner",
      offset: "-30%",
      content: function content(_ref) {
        var percent = _ref.percent;
        return "".concat((percent * 100).toFixed(0), "%");
      },
      style: {
        fontSize: 14,
        textAlign: "center",
      },
    },
    interactions: [{ type: "element-active" }],
    theme: 'custom-theme',
  };
  let todayPieChart = {
    appendPadding: 10,
    data: dataToday,
    angleField: "value",
    colorField: "type",
    radius: 0.9,
    label: {
      type: "inner",
      offset: "-30%",
      content: function content(_ref) {
        var percent = _ref.percent;
        return "".concat((percent * 100).toFixed(0), "%");
      },
      style: {
        fontSize: 14,
        textAlign: "center",
      },
    },
    interactions: [{ type: "element-active" }],
    theme: 'custom-theme',
  };

  let headStyle = {
    textAlign: "center",
    fontSize: 30,
    color: "#1D1C1C",
  };

  let bodyStyle = {
    textAlign: "center",
    fontSize: 18,
    fontWeight: 500,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    padding: 5,
  };

  let mockData = [
    {
      month: "January",
      total: 0,
      pending: 0,
      repairing: 0,
      success: 0,
    },
    {
      month: "February",
      total: 0,
      pending: 0,
      repairing: 0,
      success: 0,
    },
    {
      month: "March",
      total: 0,
      pending: 0,
      repairing: 0,
      success: 0,
    },
    {
      month: "April",
      total: 0,
      pending: 0,
      repairing: 0,
      success: 0,
    },
    {
      month: "May",
      total: 0,
      pending: 0,
      repairing: 0,
      success: 0,
    },
    {
      month: "June",
      total: 0,
      pending: 0,
      repairing: 0,
      success: 0,
    },
    {
      month: "July",
      total: 0,
      pending: 0,
      repairing: 0,
      success: 0,
    },
    {
      month: "August",
      total: 0,
      pending: 0,
      repairing: 0,
      success: 0,
    },
    {
      month: "September",
      total: 0,
      pending: 0,
      repairing: 0,
      success: 0,
    },
    {
      month: "October",
      total: 0,
      pending: 0,
      repairing: 0,
      success: 0,
    },
    {
      month: "November",
      total: 0,
      pending: 0,
      repairing: 0,
      success: 0,
    },
    {
      month: "December",
      total: 0,
      pending: 0,
      repairing: 0,
      success: 0,
    },
  ];

  let columns = [
    {
      align: "center",
      title: "Month",
      dataIndex: "month",
      key: "month",
    },
    {
      align: "center",
      title: "Total",
      dataIndex: "total",
      key: "total",
    },
    {
      align: "center",
      title: "Pending",
      dataIndex: "pending",
      key: "pending",
    },
    {
      align: "center",
      title: "Repairing",
      dataIndex: "repairing",
      key: "repairing",
    },
    {
      align: "center",
      title: "Success",
      dataIndex: "success",
      key: "success",
    },
  ];

  const auth = session.jwt;
  // function

  const fetchData = async () => {
    console.log("========== FETCHING ==========");
    await axios
      .get(
        process.env.REACT_APP_API_URL +
        'fixing-reports',
        {
          headers: {
            Authorization: "Bearer " + auth,
          },
        }
      )
      .then((res) => {
        console.log(res.data);
        let timeLower = new Date(`01-01-${year}`).getTime();
        let timeUpper = new Date(`01-01-${parseInt(year) + 1}`).getTime();
        let tempData = [];
        let todayTemp = [];
        res.data.forEach(data => {
          console.log(new Date(parseInt(data.submission_date)).setHours(0, 0, 0, 0))
          if (parseInt(data.submission_date) >= timeLower && parseInt(data.submission_date) < timeUpper) {
            tempData.push(data);
            if (new Date(parseInt(data.submission_date)).setHours(0, 0, 0, 0) === day) { todayTemp.push(data) }
          }
        });
        setFixingData(tempData);
        setTodayData(todayTemp);

        // set data for every month
        tempData.forEach((data) => {
          let month = new Date(parseInt(data.submission_date)).getMonth();

          for (let i = 0; i < 12; i++) {
            if (month === i) {
              if (data.status === "Pending") {
                console.log('Pending')
                mockData[i].total += 1;
                mockData[i].pending += 1;
              } else if (data.status === "Repairing") {
                console.log('Repairing')
                mockData[i].total += 1;
                mockData[i].repairing += 1;
              } else if (data.status === "Success") {
                console.log('Success')
                mockData[i].total += 1;
                mockData[i].success += 1;
              }
              break;
            }
          }
        });
        setMonthData(mockData);
      });
  };

  const onChange = (value, dateString) => {
    setYear(dateString);
  };

  // action
  useEffect(() => {
    fetchData();
    console.log('year', year, new Date(`01-01-${year}`).getTime())
    console.log('day', day)
  }, [year]);

  return (
    <>
      <Heading title="Fixing Reports Dashboard" />
      <Row>
        <Col span={24} style={{ textAlign: "end" }}>
          <SettingOutlined style={{ fontSize: 27, color: "#1D1C1C" }} />
        </Col>
      </Row>

      {/* Card View */}
      <Row gutter={16} style={{ paddingTop: 18 }}>
        <Col span={6}>
          <Card
            title={fixingData.filter((item) => item.status === "Pending").length || "0"}
            bordered={false}
            className="card"
            headStyle={headStyle}
            bodyStyle={{
              ...bodyStyle, background: "#ED1C24",
              color: "#F5F4EC",
            }}
          >
            Pending
          </Card>
        </Col>
        <Col span={6}>
          <Card
            title={
              fixingData.filter((item) => item.status === "Repairing").length ||
              "0"
            }
            bordered={false}
            className="card"
            headStyle={headStyle}
            bodyStyle={{
              ...bodyStyle,
              background: "#DDE03D",
            }}
          >
            Repairing
          </Card>
        </Col>
        <Col span={6}>
          <Card
            title={
              fixingData.filter((item) => item.status === "Success").length ||
              "0"
            }
            bordered={false}
            className="card"
            headStyle={headStyle}
            bodyStyle={{ ...bodyStyle, background: "#84BA40" }}
          >
            Success
          </Card>
        </Col>
        <Col span={6}>
          <Card
            title={
              fixingData.length || "0"
            }
            bordered={false}
            className="card"
            headStyle={headStyle}
            bodyStyle={{
              ...bodyStyle,
              background: "#65C8DE",
            }}
          >
            Total
          </Card>
        </Col>
      </Row>

      {/* Year Picker */}
      <Row
        gutter={16}
        style={{
          paddingTop: 30,
          paddingBottom: 20,
          paddingLeft: 10,
          paddingRight: 10,
          justifyContent: "space-between",
          alignContent: "center",
        }}
      >
        <Row>
          <h1 style={{ marginRight: 10 }}>Fixing Management Date: </h1>
          <DatePicker
            onChange={onChange}
            picker="year"
            defaultValue={moment()}
          />
        </Row>
        <Button style={{ alignSelf: "flex-end" }}>Export</Button>
      </Row>

      {/* Chart View */}
      <Row gutter={[16, 16]} align="top">
        <Col span={12}>
          <Card
            title="Today's fixing status"
            bordered={false}
            className="card"
            headStyle={{
              backgroundColor: "#CBB989",
              height: 20,
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
            }}
            bodyStyle={{
              ...bodyStyle,
            }}
          >
            <Pie
              style={{ height: 320, paddingRight: "20%", paddingLeft: "20%" }}
              {...todayPieChart}
            />
          </Card>
          <Card
            title="2021's fixing status"
            bordered={false}
            className="card"
            style={{ marginTop: 28 }}
            headStyle={{
              backgroundColor: "#CBB989",
              height: 20,
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
            }}
            bodyStyle={{
              ...bodyStyle,
            }}
          >
            <Pie
              style={{ height: 320, paddingRight: "20%", paddingLeft: "20%" }}
              {...configPieChart}
            />
          </Card>
        </Col>


        <Col span={12}>
          <Card
            title="Status of fixing sorted by month"
            bordered={false}
            className="card"
            headStyle={{
              backgroundColor: "#CBB989",
              height: 20,
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
            }}
            bodyStyle={{
              ...bodyStyle,
            }}
          >
            <Table
              columns={columns}
              dataSource={monthData}
              pagination={false}
              style={{ padding: 5 }}
            />
          </Card>
        </Col>
      </Row>
    </>
  );
}
