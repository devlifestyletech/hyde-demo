import React from 'react';
import Header from '../../components/header';
import './components/chart/styles/dashboard.css';
import { Button, DatePicker, Row, Table } from 'antd';
import { VerticalAlignBottomOutlined } from '@ant-design/icons';
import PieChart from './components/chart/PieChart';
import GraphReserves from './components/chart/GraphReserves';

const columns = [
  {
    title: 'Date',
    align: 'center',
    dataIndex: 'date',
    key: 'date',
    render: (text) => <Button type="link">{text}</Button>,
  },
  {
    title: 'Total Invoice Bill',
    align: 'center',
    dataIndex: 'total',
    key: 'total',
  },
  {
    title: 'Total Amount Water',
    align: 'center',
    dataIndex: 'total_water',
    key: 'total_water',
  },
  {
    title: 'Total Amount Common Fee',
    align: 'center',
    dataIndex: 'total_common',
    key: 'total_common',
  },
  {
    title: 'Received Amount',
    align: 'center',
    dataIndex: 'total_received',
    key: 'total_received',
  },
];

const data = [
  {
    key: '1',
    date: '01/05/2022',
    total: 200,
    total_water: 15000,
    total_common: 22500,
    total_received: 37500,
  },
  {
    key: '2',
    date: '02/05/2022',
    total: 200,
    total_water: 10000,
    total_common: 16500,
    total_received: 26500,
  },
  {
    key: '3',
    date: '03/05/2022',
    total: 200,
    total_water: 8000,
    total_common: 6800,
    total_received: 14800,
  },
  {
    key: '4',
    date: '04/05/2022',
    total: 200,
    total_water: 2500,
    total_common: 3000,
    total_received: 5500,
  },
  {
    key: '5',
    date: '05/05/2022',
    total: 200,
    total_water: 5000,
    total_common: 6000,
    total_received: 11000,
  },
  {
    key: '6',
    date: '06/05/2022',
    total: 200,
    total_water: 10000,
    total_common: 2100,
    total_received: 12100,
  },
];

const PaymentDashboard = () => {
  return (
    <>
      <Header title="Payment Dashboard" />
      <div className="top-container"></div>
      <div className="content-container">
        <Row>
          <div className="pie-graph">
            <div className="chart-title">
              <p style={{ fontSize: 18, paddingLeft: 10 }}>
                Status Payment Today
              </p>
            </div>
            <div className="chart-content">
              <PieChart />
            </div>
          </div>
          <div className="bar-graph">
            <div className="chart-title">
              <p style={{ fontSize: 18, paddingLeft: 10 }}>
                Status Payment Today
              </p>
            </div>
            <div className="chart-content">
              <GraphReserves />
            </div>
          </div>

          <div className="text-title">
            <p style={{ fontSize: 26, paddingLeft: 10 }}>
              Payment Management Month:
            </p>
          </div>
          <div className="month-graph">
            <DatePicker
              format="MMM YYYY"
              picker="month"
              placeholder="Please select Month"
              style={{
                color: '#fff',
                width: 410,
                borderRadius: 20,
                backgroundColor: '#fff',
              }}
            />
          </div>
          <div className="export-button">
            <Button
              icon={<VerticalAlignBottomOutlined />}
              disabled={true}
              type="primary"
              size="large"
              shape="round"
              style={{ float: 'right' }}
            >
              Export
            </Button>
          </div>
          <div className="table-graph">
            <Table columns={columns} dataSource={data} />;
          </div>
        </Row>
      </div>
    </>
  );
};
export default PaymentDashboard;
