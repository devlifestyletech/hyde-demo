/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import Heading from '../../../components/Header';
import { Button, Image, Input, Table } from 'antd';
import ReportModal from '../service/reportModal';
import axios from 'axios';
import { format, utcToZonedTime } from 'date-fns-tz';
import { encryptStorage } from '../../../utils/encryptStorage';

const session = encryptStorage.getItem('user_session');

const FixingReports = () => {
  const [data, setData] = useState([]);
  const [visible, setVisible] = useState(false);
  const [searchName, setSearchName] = useState('');
  const [reportValue, setReportValue] = useState(null);
  const headers = { headers: { Authorization: 'Bearer ' + session.jwt } };
  const thTimeZone = 'Asia/Bangkok';
  const status = {
    Pending: '#E86A6B',
    Repairing: '#EEC84D',
    Success: '#79CA6C',
  };

  const { Search } = Input;

  let columns = [
    {
      title: 'No.',
      dataIndex: 'number',
      key: 'number',
      align: 'center',
    },
    {
      title: 'Address',
      dataIndex: 'address_number',
      key: 'address_number',
      align: 'center',
      render: (index, record) => <div>{record.address_number}</div>,
    },
    {
      title: 'Owner',
      dataIndex: 'owner',
      key: 'owner',
      align: 'center',
      sorter: (a, b) => (a.owner > b.owner ? 1 : -1),
      render: (index, record) => <div>{record.owner?.fullname}</div>,
    },
    {
      title: 'Tel',
      dataIndex: 'tel',
      key: 'tel',
      align: 'center',
      render: (index, record) => <div>{record.owner?.tel}</div>,
    },
    {
      title: 'E-Mail',
      dataIndex: 'email',
      key: 'email',
      align: 'center',
      sorter: (a, b) => (a.email > b.email ? 1 : -1),
      render: (index, record) => <div>{record.owner?.email}</div>,
    },
  ];

  let extendsColumns = [
    {
      width: '4vw',
      title: 'No.',
      align: 'center',
      dataIndex: 'number',
      key: 'number',
    },

    {
      width: '8vw',
      title: 'Submission Date',
      dataIndex: 'submission_date_show',
      key: 'submission_date_show',
    },
    {
      title: 'Problem',
      dataIndex: 'problem',
      key: 'problem',
      align: 'center',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      align: 'center',
    },
    {
      hidden: true,
      title: 'Address',
      dataIndex: 'address_number',
      key: 'address_number',
      align: 'center',
    },
    {
      hidden: true,
      title: 'Owner',
      dataIndex: 'owner',
      key: 'owner',
    },
    {
      width: '4vw',
      title: 'Status',
      dataIndex: 'status',
      align: 'center',
      key: 'status',
      sorter: (a, b) => (a.status > b.status ? 1 : -1),
      render: (text) => (
        <>
          <div style={{ color: status[text] }}>{text}</div>
        </>
      ),
    },
    {
      width: '4vw',
      align: 'center',
      title: 'Action',
      key: 'extendsAction',
      render: (_, record) => (
        <Button
          style={{
            backgroundColor: '#D8AA81',
            color: '#F5F4EC',
            borderRadius: 20,
          }}
          key="manage_report"
          onClick={() => {
            setVisible(true);
            console.log('record', record);
            handleEdit(record);
          }}
        >
          Manage Report
        </Button>
      ),
    },
  ].filter((item) => !item.hidden);

  // function
  const handleEdit = (record) => {
    setReportValue(record);
    setVisible(true);
  };

  const handleSearch = (value) => {
    setSearchName(value.toLowerCase());
  };

  const handleSearchChange = (value) => {
    if (value.target.value === '') {
      setSearchName('');
    }
  };

  const closeModal = () => {
    console.log('closeModal');
    setVisible(false);
  };

  const fetchData = async () => {
    let residencesData = [];
    let combinesData = [];

    await axios
      .get(process.env.REACT_APP_API_URL + '/addresses?_limit=500', headers)
      .then((res) => {
        // console.log('resData', res.data.length);
        residencesData = res.data;
        // console.log(
        //   'residences DATA => ',
        //   residencesData.filter((item) => item.fixing_reports.length > 0)
        // );
        residencesData
          // .filter((item) => item.owner != null && item.owner !== undefined)
          .filter((item) => item.fixing_reports.length > 0)
          .forEach((residence, index) => {
            let residenceData = {
              key: index,
              number: index + 1,
              ...residence,
            };
            residence.fixing_reports.forEach((report, index) => {
              let date_show = format(
                utcToZonedTime(new Date(report.submission_date), thTimeZone),
                'dd MMM yyyy',
                { timeZone: 'Asia/Bangkok' }
              );
              let newReport = {
                key: residence.fixing_reports[index].id,
                number: index + 1,
                submission_date_show: date_show,
                address_number: residence.address_number,
                owner: residence.owner?.fullname,
                ...report,
              };
              residence.fixing_reports[index] = newReport;
            });
            // console.log('residenceData', residenceData);
            // console.log(residenceData.fixing_reports);
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
    console.log('session', session);
  }, []);

  return (
    <>
      <Heading title="Service Center Lists" />
      <Search
        placeholder="Search by address number"
        allowClear
        onSearch={handleSearch}
        style={{ width: 250, marginBottom: 19, marginTop: 10 }}
        onChange={handleSearchChange}
        className="search-box"
      />
      <Table
        columns={columns}
        className="tableContainer"
        expandable={{
          expandedRowRender: (record) => (
            <div>
              <Table
                columns={extendsColumns}
                dataSource={record?.fixing_reports}
                pagination={false}
              />
            </div>
          ),
          rowExpandable: (record) => record.fixing_reports != null,
        }}
        dataSource={
          searchName === ''
            ? data
            : data.filter((item) => item.address_number.includes(searchName))
        }
      />
      {visible ? (
        <ReportModal
          visible={visible}
          reportValue={reportValue}
          fetchData={fetchData}
          closeModal={closeModal}
        />
      ) : null}
    </>
  );
};

export default FixingReports;
