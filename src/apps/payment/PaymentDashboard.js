import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';
import './components/chart/styles/dashboard.css';
import { Button, Row, Space, Text, Table, DatePicker } from 'antd';
import { VerticalAlignBottomOutlined } from '@ant-design/icons';
import PieChart from './components/chart/PieChart';
import GraphReserves from './components/chart/GraphReserves';
import { getDashboard } from './services/thunk-action/payment_thunk';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import { CSVLink } from 'react-csv';

const columns = [
  {
    title: 'Date',
    align: 'center',
    dataIndex: 'Date_table',
    key: 'Date_table',
    render: (text, record) => (
      <Space size="middle">
        <a>{moment(record.Date_table).format('DD/MM/YYYY')}</a>
      </Space>
    ),
  },
  {
    title: 'Total Invoice Bill',
    align: 'center',
    dataIndex: 'Count_Bills_Date',
    key: 'Count_Bills_Date',
    render: (text, record) => (
      <p>{record.Count_Bills_Date.toLocaleString('en-US')}</p>
    ),
  },
  {
    title: 'Total Amount Water',
    align: 'center',
    dataIndex: 'Amount_water',
    key: 'Amount_water',
    render: (text, record) => (
      <p>{record.Amount_water.toLocaleString('en-US')}</p>
    ),
  },
  {
    title: 'Total Amount Common Fee',
    align: 'center',
    dataIndex: 'Amount_common_fee',
    key: 'Amount_common_fee',
    render: (text, record) => (
      <p>{record.Amount_common_fee.toLocaleString('en-US')}</p>
    ),
  },
  {
    title: 'Total Overdue',
    align: 'center',
    dataIndex: 'Overdue',
    key: 'Overdue',
    render: (text, record) => <p>{record.Overdue.toLocaleString('en-US')}</p>,
  },
  {
    title: 'Received Amount',
    align: 'center',
    dataIndex: 'Total_BillsPayment_Dashboard',
    key: 'Total_BillsPayment_Dashboard',
    render: (text, record) => (
      <p>{record.Total_BillsPayment_Dashboard.toLocaleString('en-US')}</p>
    ),
  },
];

const PaymentDashboard = () => {
  const { dataPaymentDashboard } = useSelector(
    (state) => state.PaymentActionRedux
  );
  const { MonthPicker } = DatePicker;
  const [month, setMonth] = useState('');
  const dispatch = useDispatch();
  const [FileNameExcel, setFileNameExcel] = useState('Report Payment All');

  const headers = [
    { label: 'Date_table', key: 'Date_table' },
    { label: 'Count_Bills_Dater', key: 'Count_Bills_Date' },
    { label: 'Amount_water', key: 'Amount_water' },
    { label: 'Amount_common_fee', key: 'Amount_common_fee' },
    { label: 'Overdue', key: 'Overdue' },
    {
      label: 'Total_BillsPayment_Dashboard',
      key: 'Total_BillsPayment_Dashboard',
    },
  ];
  const data = dataPaymentDashboard;

  const pageSizeOptions = ['10', '30', '50', '100'];
  const PaginationConfig = {
    defaultPageSize: pageSizeOptions[0],
    pageSizeOptions: pageSizeOptions,
    current: 1,
    showSizeChanger: true,
    total: 10,
  };

  useEffect(() => {
    dispatch(getDashboard());
  }, []);

  async function onMonthChange(date, dateString) {
    // console.log("date", date);

    console.log('dateString', dateString);
    if (dateString !== '') {
      const params = { filters: null };
      const firstDayOfTheMonth = moment(dateString)
        .startOf('month')
        .format('YYYY-MM-DD'); //2021-04-01
      const lastDayOfTheMonth = moment(dateString)
        .endOf('month')
        .format('YYYY-MM-DD'); //2021-04-30
      await setFileNameExcel(
        `Report Payment Of ${moment(dateString)
          .startOf('month')
          .format('MMM YYYY')}`
      );

      //  console.log("firstDayOfTheMonth:",firstDayOfTheMonth);
      //  console.log("firstDayOfTheMonth:",lastDayOfTheMonth);
      //  console.log("dateString:",dateString);

      params.filters = {
        firstDayOfTheMonth: firstDayOfTheMonth,
        lastDayOfTheMonth: lastDayOfTheMonth,
      };

      await setMonth(dateString);
      await dispatch(getDashboard(params));
    } else {
      await setFileNameExcel(`Report Payment All`);
      await dispatch(getDashboard());
    }
  }

  return (
    <>
      <Header title="Payment Dashboard" />
      <div className="top-container"></div>
      <div className="content-container">
        <Row>
          <div className="pie-graph">
            <div className="chart-title">
              <p style={{ fontSize: 18, paddingLeft: 10 }}>
                Status Payment Current
              </p>
            </div>
            <div className="chart-content">
              <PieChart />
            </div>
          </div>
          <div className="bar-graph">
            <div className="chart-title">
              <p style={{ fontSize: 18, paddingLeft: 10 }}>
                Status Payment Success Of Month
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
            <MonthPicker
              style={{
                color: '#fff',
                width: 410,
                borderRadius: 20,
                backgroundColor: '#fff',
              }}
              onChange={onMonthChange}
              format="MMM YYYY"
              picker="month"
              placeholder="Please select Month"
              // className="search-box"
            />
          </div>

          <div className="export-button">
            <CSVLink filename={FileNameExcel} data={data} headers={headers}>
              <Button
                icon={<VerticalAlignBottomOutlined />}
                disabled={false}
                type="primary"
                size="large"
                shape="round"
                style={{ float: 'right' }}
              >
                Export All
              </Button>
            </CSVLink>
          </div>

          <div className="table-graph">
            <Table
              columns={columns}
              dataSource={dataPaymentDashboard}
              pagination={PaginationConfig}
            />
            ;
          </div>
        </Row>
      </div>
    </>
  );
};
export default PaymentDashboard;
