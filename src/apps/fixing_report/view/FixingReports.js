/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-expressions */
/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from 'react';
import Heading from '../../../components/Header';
import { Button,Input, Table,Tag } from 'antd';
import ReportModal from '../components/ManageReport';
import { getDataFixReport } from '../service/thunk-action/fix_report_thunk'
import {MenuFixingReport} from './MenuFixingReport'
import { useSelector, useDispatch } from 'react-redux';
import Highlighter from 'react-highlight-words';
import { encryptStorage } from '../../../utils/encryptStorage';
import '../style/fixingStyle.css'
const FixingReports = () => {
  const {status_fixReport,dataFixReport,loadingTable,dataSize,paramsFixReport,pageDefault,countFCMFixReport} = useSelector((state) => state.FixReportActionRedux);
  const dispatch = useDispatch();
  const [stateReport, setStateReport] = useState([]);
  const [searchName, setSearchName] = useState('');
  const [notication, setnotication] = useState(countFCMFixReport);
    // set data
    useEffect( async() => {
      await dispatch({ type: 'CHANGE_PARAMS_FIX_REPORT', payload: paramsDataFixReport });
      await  dispatch(getDataFixReport(paramsDataFixReport));
     
    }, [notication]);
    useEffect( async() => {
      if (countFCMFixReport>=notication) {
      await setnotication(countFCMFixReport)
      }
     }, [countFCMFixReport]);
    // setting pagination Option
    const pageSizeOptions = ['20', '40', '60', '100'];
    const PaginationConfig = {
      defaultPageSize: pageSizeOptions[0],
      pageSizeOptions: pageSizeOptions,
      current: pageDefault,
      showSizeChanger: true,
      total: dataSize,
    };
    const paramsDataFixReport = {
      status: undefined,
      defaultPage: 1,
      sorter: {
        NameSort: "submission_date",
        orderSort: "descend",
      },
      filters: {
        address_number: null,
      },
      pagesize: PaginationConfig.defaultPageSize,
    };
  const { Search } = Input;

  // table change
  const handleSearchChange = (value) => {
    if (value.target.value === '') {
      paramsFixReport.filters = {
        address_number: null,
      };
      dispatch(getDataFixReport(paramsFixReport));
      setSearchName('');
    }
  };

  const manageReport = async ({ currentTarget }) => {
    const exportLoading = [...stateReport];
    exportLoading[currentTarget.value] = true;
    await setStateReport(exportLoading);
    const result = dataFixReport.filter((e) => {
      if (e.id === currentTarget.value) {
        e.readStatus=false
        return e
      }
    });
    const FCMtoken = await encryptStorage.getItem('fcm_token_data');
    if (FCMtoken !== null && FCMtoken !== undefined) {
      let countFCMTotal = countFCMFixReport;
      FCMtoken.map((e) => {
        if(e.title === 'ServiceCenter'){
          if (
            e.userID === result[0]?.id &&
            e.readStatus === false
          ) {
            e.readStatus = true;
            countFCMTotal = countFCMTotal - 1;
          }
        }
      });
      await encryptStorage.setItem('fcm_token_data', JSON.stringify(FCMtoken));
      dispatch({ type: 'CHANGE_FCM_COUNT_FIX_REPORT', payload: countFCMTotal });
      FCMtoken.sort((a, b) => b.receriveTime.localeCompare(a.receriveTime));
    }
    dispatch({ type: 'CHANGE_STATE_MANAGE_FIX_REPORT', payload: result });
    dispatch({ type: 'MODAL_FIX_REPORT', payload: true });
    exportLoading[currentTarget.value] = false;
    await setStateReport(exportLoading);
  };

  const handleSearch = (value) => {
    if (value) {
      if (paramsFixReport.filters !== undefined &&paramsFixReport.filters !== null) {
        paramsFixReport.filters = {
          address_number: [value],
        };
        dispatch(getDataFixReport(paramsFixReport));
      } else {
        paramsFixReport.filters = {
          address_number: [value],
        };
      }
    }
    value!== undefined?  setSearchName(value.toLowerCase()):null
  };

  const handleTableChange = async (pagination, filters, sorter) => {
    await dispatch({
      type: 'CHANGE_PAGE_DEFAULT_FIX_REPORT',
      payload: pagination?.current,
    });
    (paramsFixReport.status = status_fixReport),
      (paramsFixReport.defaultPage = pagination.current),
      (paramsFixReport.pagesize = pagination.pageSize);
    paramsFixReport.filters = {
      address_number:
        filters?.address_number !== undefined
          ? filters?.address_number
          : null,
    };

    if (sorter.order !== undefined) {
      paramsFixReport.sorter = {
        NameSort: sorter.columnKey,
        orderSort: sorter.order,
      };
    } else {
      paramsFixReport.sorter = sorter.order;
    }
    dispatch(getDataFixReport(paramsFixReport));
  };
  let columnsFix_report = [
    {
      title: 'No.',
      dataIndex: 'number',
      key: 'number',
      align: 'center',
      width: '10%',
    },
    {
      title: 'Full name',
      dataIndex: 'owner',
      key: 'owner',
      align: 'center',
      width: '10%',

      sorter: (a, b) => a.owner !== undefined ? a.owner.localeCompare(b.owner):null,
    },
    {
      title: 'Address',
      dataIndex: 'address_number',
      key: 'address_number',
      align: 'center',
      width: '10%',
      render: (text) => (
        <Highlighter
          highlightStyle={{ backgroundColor: '#D8AA81', padding: 0 }}
          searchWords={
            paramsFixReport.filters.address_number !== null
              ? paramsFixReport.filters.address_number
              : ['']
          }
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ),
      sorter: (a, b) => a.address_number.localeCompare(b.address_number),
    },
    {
      title: 'Problem',
      dataIndex: 'problem',
      key: 'problem',
      align: 'center',
      width: '10%',

      sorter: (a, b) => a.problem !==undefined? a.problem.localeCompare(b.problem):null,
    },
    {
      title: 'Submission Date',
      align: 'center',
      dataIndex: 'submission_date',
      key: 'submission_date',
      width: '10%',
      sorter: (a, b) => a.submission_date !==undefined? a.submission_date.localeCompare(b.submission_date):null,
    },
    {
      title: 'Tel',
      dataIndex: 'tel',
      key: 'tel',
      align: 'center',
      width: '10%',
      sorter: (a, b) => a.tel !==undefined? a.tel.localeCompare(b.tel):null,
    },
    {
      title: 'Status',
      align: 'center',
      dataIndex: 'status',
      key: 'status',
      width: '10%',
      sorter: (a, b) => a.status !==undefined? a.status.localeCompare(b.status):null,
      render: (status) => {
        switch (status) {
          case "Pending":    
            return <Tag style={{borderRadius:'0px'}} color="red">{status}</Tag>;
            break;
            case "Repairing":    
            return <Tag  style={{borderRadius:'0px'}} color="orange">{status}</Tag>;
            break;
            case "Success":    
            return <Tag style={{borderRadius:'0px'}}  color="green">{status}</Tag>;
            break;
          default:
            break;
        }
      },
    },
    {
      title: 'Action',
      align: 'center',
      dataIndex: 'action',
      key: 'BillsPayment_Invoice',
      width: '10%',
      render: (text, record) => (
        <>
          <span
          style={{color:'#D8AA81' }}
            value={record.id}
            type="Default"
            shape="round"
            loading={stateReport[record.id]}
            onClick={manageReport}
          >
            Manage Report
          </span>
        </>
      ),
    },
  ];
  return (
    <div>
       <ReportModal/>
      <Heading title="Service Center Lists" />
      <Search
        placeholder="Search by address number"
        allowClear
        onSearch={handleSearch}
        style={{ width: 250, marginBottom: 19, marginTop: 10 }}
        onChange={handleSearchChange}
        className="search-box"
      />
      <MenuFixingReport/>
      <Table
        columns={columnsFix_report}
        className="tableContainer"
        onChange={handleTableChange}
        loading={loadingTable}
        pagination={PaginationConfig}
        dataSource={dataFixReport}
        rowClassName={ (record, index) => (record.readStatus===true?"red":null)
        }
      />
        {/* <ReportModal/> */}
    </div>
  );
};

export default FixingReports;