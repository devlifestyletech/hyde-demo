/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import Heading from '../../../components/Header';
import { Button, Card, Col, DatePicker, Row, Table } from 'antd';
import { G2, Pie } from '@ant-design/charts';
import '../style/fixingStyle.css';
import { VerticalAlignBottomOutlined } from '@ant-design/icons';
import axios from 'axios';
import moment from 'moment';

import { encryptStorage } from '../../../utils/encryptStorage';

const session = encryptStorage.getItem('user_session');
export default function FixingReportDashBoard() {
  const [fixingData, setFixingData] = useState([]);
  const [todayData, setTodayData] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const day = new Date().setHours(0, 0, 0, 0);
  const [monthData, setMonthData] = useState([]);
  const headers = { headers: { Authorization: 'Bearer ' + session.jwt } };

  const { registerTheme } = G2;
  registerTheme('custom-theme', {
    colors10: ['#E86A6B', '#EEC84D', '#79CA6C'],
  });

  let data = [
    {
      type: 'Pending',
      value: fixingData.filter((item) => item.status === 'Pending').length || 0,
    },
    {
      type: 'Repairing',
      value:
        fixingData.filter((item) => item.status === 'Repairing').length || 0,
    },
    {
      type: 'Success',
      value: fixingData.filter((item) => item.status === 'Success').length || 0,
    },
  ];
  let dataToday = [
    {
      type: 'Pending',
      value: todayData.filter((item) => item.status === 'Pending').length || 0,
    },
    {
      type: 'Repairing',
      value:
        todayData.filter((item) => item.status === 'Repairing').length || 0,
    },
    {
      type: 'Success',
      value: todayData.filter((item) => item.status === 'Success').length || 0,
    },
  ];

  let configPieChart = {
    appendPadding: 10,
    data: data,
    angleField: 'value',
    colorField: 'type',
    radius: 0.9,
    label: {
      type: 'inner',
      offset: '-30%',
      content: function content(_ref) {
        var percent = _ref.percent;
        return ''.concat((percent * 100).toFixed(0), '%');
      },
      style: {
        fontSize: 14,
        textAlign: 'center',
      },
    },
    interactions: [{ type: 'element-active' }],
    theme: 'custom-theme',
  };
  let todayPieChart = {
    appendPadding: 10,
    data: dataToday,
    angleField: 'value',
    colorField: 'type',
    radius: 0.9,
    label: {
      type: 'inner',
      offset: '-30%',
      content: function content(_ref) {
        var percent = _ref.percent;
        return ''.concat((percent * 100).toFixed(0), '%');
      },
      style: {
        fontSize: 14,
        textAlign: 'center',
      },
    },
    interactions: [{ type: 'element-active' }],
    theme: 'custom-theme',
  };

  let headStyle = {
    textAlign: 'center',
    fontSize: 30,
    color: '#1D1C1C',
  };

  let bodyStyle = {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 500,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    padding: 5,
  };

  let mockData = [
    {
      month: 'January',
      total: 0,
      pending: 0,
      repairing: 0,
      success: 0,
    },
    {
      month: 'February',
      total: 0,
      pending: 0,
      repairing: 0,
      success: 0,
    },
    {
      month: 'March',
      total: 0,
      pending: 0,
      repairing: 0,
      success: 0,
    },
    {
      month: 'April',
      total: 0,
      pending: 0,
      repairing: 0,
      success: 0,
    },
    {
      month: 'May',
      total: 0,
      pending: 0,
      repairing: 0,
      success: 0,
    },
    {
      month: 'June',
      total: 0,
      pending: 0,
      repairing: 0,
      success: 0,
    },
    {
      month: 'July',
      total: 0,
      pending: 0,
      repairing: 0,
      success: 0,
    },
    {
      month: 'August',
      total: 0,
      pending: 0,
      repairing: 0,
      success: 0,
    },
    {
      month: 'September',
      total: 0,
      pending: 0,
      repairing: 0,
      success: 0,
    },
    {
      month: 'October',
      total: 0,
      pending: 0,
      repairing: 0,
      success: 0,
    },
    {
      month: 'November',
      total: 0,
      pending: 0,
      repairing: 0,
      success: 0,
    },
    {
      month: 'December',
      total: 0,
      pending: 0,
      repairing: 0,
      success: 0,
    },
  ];

  let columns = [
    {
      align: 'center',
      title: 'Month',
      dataIndex: 'month',
      key: 'month',
    },
    {
      align: 'center',
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
    },
    {
      align: 'center',
      title: 'Pending',
      dataIndex: 'pending',
      key: 'pending',
    },
    {
      align: 'center',
      title: 'Repairing',
      dataIndex: 'repairing',
      key: 'repairing',
    },
    {
      align: 'center',
      title: 'Success',
      dataIndex: 'success',
      key: 'success',
    },
  ];

  // function
  const fetchData = async () => {
    console.log('========== FETCHING ==========');
    await axios
      .get(
        `${
          process.env.REACT_APP_API_URL
        }/fixing-reports?submission_date_gte=${year}-01-01&submission_date_lt=${
          parseInt(year) + 1
        }-01-01`,
        headers
      )
      .then((res) => {
        console.log('res', res.data);
        console.log('new', new Date().toISOString().slice(0, 10));
        setFixingData(res.data);
        let todayTemp = [];
        res.data.forEach((data) => {
          let month = parseInt(data.submission_date.substring(5, 7)) - 1;

          if (
            data.submission_date.split('T')[0] ===
            new Date().toISOString().slice(0, 10)
          ) {
            todayTemp.push(data);
          }

          for (let i = 0; i < 12; i++) {
            console.log('month', month, i);

            if (month === i) {
              if (data.status === 'Pending') {
                console.log('Pending');
                mockData[i].total += 1;
                mockData[i].pending += 1;
              } else if (data.status === 'Repairing') {
                console.log('Repairing');
                mockData[i].total += 1;
                mockData[i].repairing += 1;
              } else if (data.status === 'Success') {
                console.log('Success');
                mockData[i].total += 1;
                mockData[i].success += 1;
              }
              break;
            }
          }
        });
        setTodayData(todayTemp);
        setMonthData(mockData);
      });
  };

  const onChange = (value, dateString) => {
    setYear(dateString);
  };

  // action
  useEffect(() => {
    fetchData();
    console.log('year', year, new Date(`01-01-${year}`).getTime());
    console.log('day', day);
  }, [year]);

  return (
    <>
      <Heading title="Service Center Dashboard" />
      {/* Card View */}
      <Row gutter={16} style={{ paddingTop: 18 }}>
        <Col span={6}>
          <Card
            title={
              fixingData.filter((item) => item.status === 'Pending').length ||
              '0'
            }
            bordered={false}
            className="card"
            headStyle={headStyle}
            bodyStyle={{
              ...bodyStyle,
              background: '#E86A6B',
              color: '#F5F4EC',
            }}
          >
            Pending
          </Card>
        </Col>
        <Col span={6}>
          <Card
            title={
              fixingData.filter((item) => item.status === 'Repairing').length ||
              '0'
            }
            bordered={false}
            className="card"
            headStyle={headStyle}
            bodyStyle={{
              ...bodyStyle,
              background: '#EEC84D',
            }}
          >
            Repairing
          </Card>
        </Col>
        <Col span={6}>
          <Card
            title={
              fixingData.filter((item) => item.status === 'Success').length ||
              '0'
            }
            bordered={false}
            className="card"
            headStyle={headStyle}
            bodyStyle={{ ...bodyStyle, background: '#79CA6C' }}
          >
            Success
          </Card>
        </Col>
        <Col span={6}>
          <Card
            title={fixingData.length || '0'}
            bordered={false}
            className="card"
            headStyle={headStyle}
            bodyStyle={{
              ...bodyStyle,
              background: '#65C8DE',
            }}
          >
            Total
          </Card>
        </Col>
      </Row>

      {/* Year Picker */}
      <div
        className="flex-container"
        style={{ marginTop: 30, marginBottom: 30 }}
      >
        <Row>
          <h1 style={{ marginRight: 10 }}>Fixing Management Date: </h1>
          <DatePicker
            style={{ width: 250 }}
            onChange={onChange}
            picker="year"
            defaultValue={moment()}
          />
        </Row>

        <Button
          icon={<VerticalAlignBottomOutlined />}
          type="primary"
          size="large"
          shape="round"
          style={{ float: 'right' }}
        >
          Export
        </Button>
      </div>

      {/* Chart View */}
      <Row gutter={[16, 16]} align="top">
        <Col span={12}>
          <Card
            title="Today's service status"
            bordered={false}
            className="card"
            headStyle={{
              backgroundColor: '#D3D3D3',
              height: 20,
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
            }}
            bodyStyle={{
              ...bodyStyle,
            }}
          >
            <Pie
              style={{
                height: 320,
                paddingRight: '20%',
                paddingLeft: '20%',
              }}
              {...todayPieChart}
            />
          </Card>
          <Card
            title={`${year}'s service status`}
            bordered={false}
            className="card"
            style={{ marginTop: 28 }}
            headStyle={{
              backgroundColor: '#D3D3D3',
              height: 20,
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
            }}
            bodyStyle={{
              ...bodyStyle,
            }}
          >
            <Pie
              style={{
                height: 320,
                paddingRight: '20%',
                paddingLeft: '20%',
              }}
              {...configPieChart}
            />
          </Card>
        </Col>

        <Col span={12}>
          <Table
            className="styTableControl"
            columns={columns}
            title={() => 'Status of service sorted by month'}
            dataSource={monthData}
            pagination={false}
            style={{ backgroundColor: 'transparent' }}
          />
        </Col>
      </Row>
    </>
  );
}
