/* eslint-disable no-unused-expressions */
/* eslint-disable react-hooks/rules-of-hooks */
import React, { useRef, useState, useEffect } from 'react';
import {
  Table,
  Input,
  Button,
  Space,
  Tag,
  Modal,
  notification,
  DatePicker,
  Row,
  Col,
} from 'antd';
import {
  DeleteFilled,
  SearchOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import ModalExportBilling from './Modal/ModalExportBilling';
import ModalPendingBill from './Modal/ModalPending';
import ModalReject from './Modal/ModalReject';
import {
  getDataSCB,
  deleteBillingPayment,
  getOutDate,
} from '../services/API/payment_api';
import {
  getBillingPayment,
  getCustomerList,
} from '../services/thunk-action/payment_thunk';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import logo from '../../assets/images/hyde-logo.svg';
import { encryptStorage } from '../../../utils/encryptStorage';
const { RangePicker } = DatePicker;
const statePayment = {
  searchText: '',
  searchedColumn: '',
  dataBillingPayment: null,
  dataCreateBilling: null,
  visible2: false,
  paymentDetail: null,
};

export const Table_payment = () => {
  const {
    status_billing,
    dataBilling,
    loadingTable,
    dataSize,
    paramsBilling,
    pageDefault,
    countFCM,
  } = useSelector((state) => state.PaymentActionRedux);
  const dispatch = useDispatch();
  let countTotal = countFCM;
  const [state, setPayment] = useState(statePayment);
  const [loadingCreate, setloadingCreate] = useState([]);
  const [View, setView] = useState([]);
  const [Del, setDel] = useState([]);
  const [Verify, setVerify] = useState([]);
  const [VerifyReject, setVerifyReject] = useState([]);

  const [Export, setExport] = useState([]);
  useEffect(async () => {
    await getAllnotFCMList();
    await dispatch({
      type: 'CHANGE_PARAMS_BILLING',
      payload: paramsBillingPayment,
    });
    await dispatch(getBillingPayment(paramsBillingPayment));
  }, []);
  // setting pagination Option
  const pageSizeOptions = ['20', '40', '60', '100'];
  const PaginationConfig = {
    defaultPageSize: pageSizeOptions[0],
    pageSizeOptions: pageSizeOptions,
    current: pageDefault,
    showSizeChanger: true,
    total: dataSize,
  };
  const paramsBillingPayment = {
    status: 'Payment successful',
    defaultPage: 1,
    sorter: undefined,
    filters: {
      Address_Customer: null,
    },
    pagesize: PaginationConfig.defaultPageSize,
  };
  const getAllnotFCMList = async () => {
    const FCMtoken = await encryptStorage.getItem('fcm_token_data');
    if (FCMtoken !== null && FCMtoken !== undefined) {
      let countFCMTotal = 0;
      FCMtoken.map((e) => {
        if (e.readStatus === false) {
          countFCMTotal = countFCMTotal + 1;
        }
      });
      dispatch({ type: 'CHANGE_FCM_COUNT', payload: countFCMTotal });
      if (countFCMTotal > 0) {
        paramsBillingPayment.status = 'Pending review';
        await dispatch({ type: 'CHANGE_COUNT', payload: 2 });
      }
      console.log('====================================');
      console.log('countFCMTotal:', countFCMTotal);
      console.log('====================================');
      FCMtoken.sort((a, b) => b.receriveTime.localeCompare(a.receriveTime));
    }
  };
  const getTime = (e) => {
    let Time = [];
    e.map((e) => {
      Time.push(moment(e).format('YYYY-MM-DD HH:mm:ss'));
    });

    paramsBilling.filters = {
      createBill: Time,
    };
  };

  const dateImeRender = (
    <RangePicker
      ranges={{
        Today: [moment().startOf('day'), moment().endOf('day')],
        'This Month': [moment().startOf('month'), moment().endOf('month')],
      }}
      size={'small'}
      style={{ marginBottom: 8 }}
      showTime={{ format: 'HH:mm' }}
      format="DD/MM/YYYY HH:mm"
      onChange={getTime}
      // onOk={onOk}
    />
  );

  // setting pagination Option

  const exportBillingModal = async ({ currentTarget }) => {
    const exportLoading = [...Export];
    exportLoading[currentTarget.value] = true;
    await setExport(exportLoading);
    const result = dataBilling.filter((e) => {
      return e.BillsPayment_Invoice === currentTarget.value;
    });

    dispatch({ type: 'EXPORT_ALL_DATABILLING', payload: result });
    dispatch({ type: 'CHANGE_STATE_EXPORT_BILLING', payload: true });
    exportLoading[currentTarget.value] = false;
    await setExport(exportLoading);
  };

  // approve
  const approveBillingModal = async ({ currentTarget }) => {
    const verifyLoading = [...Verify];
    verifyLoading[currentTarget.value] = true;
    await setVerify(verifyLoading);
    let resultSCB = {};
    const [result] = dataBilling.filter((e) => {
      return e.BillsPayment_Invoice === currentTarget.value;
    });
    resultSCB = await getDataSCB(currentTarget.value);
    resultSCB === undefined ? (resultSCB = {}) : null;
    resultSCB.BillsPayment_Invoice = result.BillsPayment_Invoice;
    resultSCB.Address_Customer = result.Address_Customer;
    resultSCB.Name_Customer = result.Name_Customer;
    resultSCB.idBilling = result.id;
    resultSCB.imageURL = result.imageURL;
    resultSCB.BillsPayment_AllType = result.BillsPayment_AllType;
    dispatch({ type: 'CHANGE_STATE_EXPORT_APPROVE', payload: [resultSCB] });
    dispatch({ type: 'MODAL_PENDING', payload: true });
    verifyLoading[currentTarget.value] = false;
    await setVerify(verifyLoading);

    const FCMtoken = await encryptStorage.getItem('fcm_token_data');
    if (FCMtoken !== null && FCMtoken !== undefined) {
      let countFCMTotal = countFCM;
      FCMtoken.map((e) => {
        console.log('====================================');
        console.log('billPaymentRef1:', e, result.BillsPayment_Invoice);
        console.log('====================================');
        if (
          e.billPaymentRef1 === result.BillsPayment_Invoice &&
          e.readStatus === false
        ) {
          e.readStatus = true;
          countFCMTotal = countFCMTotal - 1;
        }
      });
      await encryptStorage.setItem('fcm_token_data', JSON.stringify(FCMtoken));
      dispatch({ type: 'CHANGE_FCM_COUNT', payload: countFCMTotal });

      console.log('====================================');
      console.log('countFCMTotal:', countFCMTotal);
      console.log('====================================');
      FCMtoken.sort((a, b) => b.receriveTime.localeCompare(a.receriveTime));
    }
  };
  //approve
  const approveBillingModalReject = async ({ currentTarget }) => {
    const verifyLoadingReject = [...VerifyReject];
    verifyLoadingReject[currentTarget.value] = true;
    await setVerifyReject(verifyLoadingReject);
    let resultSCB = {};
    const [result] = dataBilling.filter((e) => {
      return e.BillsPayment_Invoice === currentTarget.value;
    });
    resultSCB = await getDataSCB(currentTarget.value);
    resultSCB === undefined ? (resultSCB = {}) : null;
    resultSCB.BillsPayment_Invoice = result.BillsPayment_Invoice;
    resultSCB.Address_Customer = result.Address_Customer;
    resultSCB.Name_Customer = result.Name_Customer;
    resultSCB.idBilling = result.id;
    resultSCB.imageURL = result.imageURL;
    resultSCB.BillsPayment_AllType = result.BillsPayment_AllType;
    resultSCB.annotation_payment = result.annotation_payment;
    dispatch({ type: 'CHANGE_STATE_EXPORT_APPROVE', payload: [resultSCB] });
    dispatch({ type: 'MODAL_REJECT', payload: true });
    verifyLoadingReject[currentTarget.value] = false;
    await setVerifyReject(verifyLoadingReject);
  };
  // showDetail
  const selectedRow = async ({ currentTarget }) => {
    const viewLoadings = [...View];
    viewLoadings[currentTarget.value] = true;
    await setView(viewLoadings);

    const result = dataBilling.filter((e) => {
      return e.BillsPayment_Invoice === currentTarget.value;
    });
    if (status_billing !== 'Bill not generated') {
      Modal.warning({
        title: 'Billing Payment Detail',
        width: '820px',
        hight:'900px',
        icon: <ExclamationCircleOutlined />,
        content: (
          <div>
            {result !== null
              ? result.map((e) => {
                  return (
                    <>
                      <div className="container-fluid">
                        <Row>
                          <Col span={12}>
                            <div
                              className="col-4"
                              style={{ textAlign: 'left' }}
                            >
                              <img
                                src={logo}
                                style={{
                                  width: '241px',
                                  height:'90px',
                                  marginTop: '4%',
                                  marginLeft: '15%',
                                  paddingBottom: '5%',
                                }}
                              />
                            </div>
                          </Col>
                          <Col span={12}>
                            <div
                              className="col-8"
                              style={{ textAlign: 'right' }}
                            >
                              <h3 style={{ fontStyle: 'bold' }}>
                                <span>
                                  Hyde Heritage at Thonglor Condominium
                                </span>
                              </h3>
                              <h3 style={{ fontStyle: 'bold' }}>
                                <span>Juristic Person1199 Sukhumvit Rd.</span>
                              </h3>
                              <h3 style={{ fontStyle: 'bold' }}>
                                <span>
                                  Klongton Nua, Wattana, Bangkok, 10110
                                </span>
                              </h3>
                              <h3 style={{ fontStyle: 'bold' }}>
                                <span>Tel. 0987635822</span>
                              </h3>
                            </div>
                          </Col>
                        </Row>

                        <Row style={{ paddingBottom: '2vh' }}>
                          <Col
                            span={12}
                            style={{
                              textAlign: 'left',
                              paddingLeft: '',
                            }}
                          >
                            <span>
                              Invoice Bill: {e?.BillsPayment_Invoice}
                              <br />
                              Tax number: 0012254
                              <br />
                              Name Owner: {e?.Name_Customer}
                              <br />
                              Address: {e?.Address_Customer}
                              <br />
                            </span>
                          </Col>
                          <Col
                            span={12}
                            style={{
                              textAlign: 'left',
                              paddingLeft: '70px',
                            }}
                          >
                            <span>
                              Due Date
                              <br />
                              From : {e?.BillsPayment_Date_Start}
                              <br />
                              To : {e?.BillsPayment_Date_End}
                              <br />
                              {/* Issued by: Admin2*/}
                              Create on : {e?.BillsPayment_Date_Start}
                              <br />
                            </span>
                          </Col>
                        </Row>

                        <div className="container-fluid">
                          <table>
                            <tr>
                              <th
                                style={{
                                  backgroundColor: '#B8B8B8',
                                  color: '#000000',
                                  // borderTopLeftRadius: "10px",
                                  width: '30%',
                                  textAlign: 'center',
                                }}
                              >
                                No.
                              </th>
                              <th
                                style={{
                                  backgroundColor: '#B8B8B8',
                                  color: '#000000',
                                  width: '30%',
                                  textAlign: 'center',
                                }}
                              >
                                Detail
                              </th>
                              <th
                                style={{
                                  backgroundColor: '#B8B8B8',
                                  color: '#000000',
                                  // borderTopRightRadius: "10px",
                                  width: '30%',
                                  textAlign: 'center',
                                }}
                              >
                                Amount
                              </th>
                            </tr>
                            {e?.BillsPayment_AllType
                              ? e?.BillsPayment_AllType?.map((f, j) => {
                                  return (
                                    <tr
                                      style={{
                                        textAlign: 'center',
                                        backgroundColor: '#E2E1E1',
                                        borderBottomWidth: 10,
                                        borderColor: '#000000',
                                      }}
                                    >
                                      <td
                                        style={{
                                          borderBottomWidth: 1,
                                          borderColor: '#B8B8B8',
                                        }}
                                      >
                                        {j + 1}
                                      </td>
                                      <td
                                        style={{
                                          borderBottomWidth: 1,
                                          borderColor: '#B8B8B8',
                                        }}
                                      >
                                        {f.subBilling}
                                      </td>
                                      <td
                                        style={{
                                          borderBottomWidth: 1,
                                          borderColor: '#B8B8B8',
                                        }}
                                      >
                                        {f.amount}
                                      </td>
                                    </tr>
                                  );
                                })
                              : null}
                          </table>
                        </div>
                        <div className="container-fluid">
                          <div
                            className="row"
                            style={{
                              paddingTop: '15%',
                              backgroundColor: '#E2E1E1',
                            }}
                          >
                            <Row>
                              <Col span={8} style={{ textAlign: 'left' }}>
                                {' '}
                              </Col>
                              <Col
                                span={8}
                                style={{
                                  textAlign: 'left',
                                  paddingLeft: '10%',
                                }}
                              >
                                Sub Total:
                                <br />
                                Vat:
                                <br />
                                <span
                                  style={{ WebkitTextStroke: '0.5px black' }}
                                >
                                  Grand Total:
                                  <br />
                                </span>
                              </Col>
                              <Col span={4} style={{textAlign: 'left' }}>
                                {e?.Total_BillsPayment}
                                <br />
                                0.00 <br />
                                <span
                                  style={{ WebkitTextStroke: '0.5px black' }}
                                >
                                  {e?.Total_BillsPayment}
                                  <br />
                                </span>
                              </Col>
                              <Col span={2} style={{ textAlign: 'left' }}>
                                {' '}
                                THB.
                                <br />
                                THB.
                                <br />
                                <span
                                  style={{ WebkitTextStroke: '0.5px black' }}
                                >
                                  {' '}
                                  THB.
                                  <br />
                                </span>
                              </Col>
                            </Row>
                          </div>
                        </div>
                      </div>
                    </>
                  );
                })
              : null}
          </div>
        ),
        async onOk() {
          viewLoadings[currentTarget.value] = false;
          await setView(viewLoadings);
        },
      });
    }
  };
  // showDetail

  //delete billingPayment
  const deleteBillingByID = async ({ currentTarget }) => {
    const delLoading = [...Del];
    delLoading[currentTarget.value] = true;
    await setDel(delLoading);

    Modal.confirm({
      title: 'Are you sure delete billing payment',
      icon: <ExclamationCircleOutlined />,
      content: ` payment id ${currentTarget.value} ?`,
      okText: 'Yes',
      async onOk() {
        await deleteID(currentTarget.value);
        delLoading[currentTarget.value] = false;
        await setDel(delLoading);
      },
      cancelText: 'No',
      async onCancel() {
        delLoading[currentTarget.value] = false;
        await setDel(delLoading);
      },
    });
  };
  const deleteID = async (id) => {
    const resultDelete = await deleteBillingPayment(id);
    if (resultDelete) {
      notification['success']({
        duration: 2,
        message: 'DeleteBillingPayment',
        description: 'Delete billing payment by ID successfully.',
        style: { borderRadius: '25px' },
      });
      paramsBilling.status = 'Wait for payment';
      paramsBilling.defaultPage = 1;
      dispatch({ type: 'CHANGE_PAGE_DEFAULT', payload: 1 });
      dispatch(getBillingPayment(paramsBilling));
    } else {
      notification['error']({
        duration: 2,
        message: 'DeleteBillingPayment',
        description: 'Delete billing payment by ID failed.',
        style: { borderRadius: '25px' },
      });
    }
  };

  //delete billingPayment

  // create billingPayment by Id
  const createBilling = async ({ currentTarget }) => {
    let total = 0;
    const newLoadings = [...loadingCreate];
    newLoadings[currentTarget.value] = true;
    await setloadingCreate(newLoadings);
    const [result] = dataBilling.filter((e) => {
      return e.address === currentTarget.value;
    });
    const dataOutdate = await getOutDate(currentTarget.value);
    if (dataOutdate.length > 0) {
      dataOutdate.map((e) => {
        total += parseFloat(e.Total_BillsPayment);
      });
      result.totalCost = total;
      result.Cost = 'Overdue';
    } else {
      result.totalCost = null;
      result.Cost = null;
    }
    // console.log("createBilling:", dataOutdate);
    await dispatch({ type: 'CREATE_BILLING', payload: result });
    dispatch({ type: 'CHANGE_STATE', payload: true });
    newLoadings[currentTarget.value] = false;
    await setloadingCreate(newLoadings);
  };

  // create billingPayment by Id

  // table change

  const handleTableChange = async (pagination, filters, sorter) => {
    console.log('handleTableChange:', pagination);
    await dispatch({
      type: 'CHANGE_PAGE_DEFAULT',
      payload: pagination?.current,
    });
    (paramsBilling.status = status_billing),
      (paramsBilling.defaultPage = pagination.current),
      (paramsBilling.pagesize = pagination.pageSize);
    paramsBilling.filters = {
      // BillsPayment_Invoice:
      //   filters?.BillsPayment_Invoice !== undefined
      //     ? filters?.BillsPayment_Invoice
      //     : null,
      Address_Customer:
        filters?.Address_Customer !== undefined
          ? filters?.Address_Customer
          : null,
      Name_Customer:
        filters?.Name_Customer !== undefined ? filters?.Name_Customer : null,
      Total_BillsPayment:
        filters?.Total_BillsPayment !== undefined
          ? filters?.Total_BillsPayment
          : null,
    };

    if (sorter.order !== undefined) {
      paramsBilling.sorter = {
        NameSort: sorter.columnKey,
        orderSort: sorter.order,
      };
    } else {
      paramsBilling.sorter = sorter.order;
    }
    if (status_billing === 'Bill not generated') {
      dispatch(getCustomerList(paramsBilling));
    } else {
      dispatch(getBillingPayment(paramsBilling));
    }
  };
  // table change
  let columns = [
    {
      title: 'Invoice Bill',
      align: 'center',
      dataIndex: 'BillsPayment_Invoice',
      key: 'BillsPayment_Invoice',
      width: '10%',
      sorter: (a, b) =>
        a.BillsPayment_Invoice !== undefined
          ? a.BillsPayment_Invoice.localeCompare(b.BillsPayment_Invoice)
          : null,
    },
    {
      title: 'Room Number',
      align: 'center',
      dataIndex: 'Address_Customer',
      key: 'Address_Customer',
      width: '10%',
      render: (text) => (
        <Highlighter
          highlightStyle={{ backgroundColor: '#D8AA81', padding: 0 }}
          searchWords={
            paramsBilling.filters.Address_Customer !== null
              ? paramsBilling.filters.Address_Customer
              : ['']
          }
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ),
      sorter: (a, b) =>
        a.Address_Customer !== undefined
          ? a.Address_Customer.localeCompare(b.Address_Customer)
          : null,
    },
    {
      title: 'Name Owner',
      align: 'center',
      dataIndex: 'Name_Customer',
      key: 'Name_Customer',
      width: '10%',

      sorter: (a, b) =>
        a.Address_Customer !== undefined
          ? a.Address_Customer.localeCompare(b.Address_Customer)
          : null,
    },
    {
      title: 'Due Date',
      align: 'center',
      dataIndex: 'action',
      key: 'BillsPayment_Invoice',
      width: '10%',
      render: (text, record) => (
        <Space size="middle">
          <a>
            {moment(record.BillsPayment_Date_Start).format('DD/MM/YYYY')} -{' '}
            {moment(record.BillsPayment_Date_End).format('DD/MM/YYYY')}
          </a>
        </Space>
      ),
    },
    {
      title: 'Total',
      align: 'center',
      dataIndex: 'Total_BillsPayment',
      key: 'Total_BillsPayment',
      width: '10%',

      sorter: (a, b) =>
        a.Total_BillsPayment !== undefined
          ? a.Total_BillsPayment - b.Total_BillsPayment
          : null,
    },
    {
      title: 'Status',
      align: 'center',
      dataIndex: 'BillsPayment_Status',
      key: 'BillsPayment_Status',
      width: '10%',
      render: (BillsPayment_Status) => {
        return <Tag color="green">{BillsPayment_Status}</Tag>;
      },
    },
    {
      title: 'Create Bill',
      align: 'center',
      dataIndex: 'createdAt',
      key: 'createBill',
      width: '10%',

      sorter: (a, b) =>
        a.createdAt !== undefined
          ? a.createdAt.localeCompare(b.createdAt)
          : null,
    },
    {
      title: 'Export',
      align: 'center',
      dataIndex: 'action',
      key: 'BillsPayment_Invoice',
      width: '10%',
      render: (text, record) => (
        <>
          <Button
            value={record.BillsPayment_Invoice}
            type="Default"
            shape="round"
            loading={Export[record.BillsPayment_Invoice]}
            onClick={exportBillingModal}
          >
            Export
          </Button>
        </>
      ),
    },
  ];
  const PendingReview = [
    {
      title: 'Invoice Bill',
      align: 'center',
      dataIndex: 'BillsPayment_Invoice',
      key: 'BillsPayment_Invoice',
      width: '10%',
      sorter: (a, b) =>
        a.BillsPayment_Invoice !== undefined
          ? a.BillsPayment_Invoice.localeCompare(b.BillsPayment_Invoice)
          : null,
    },
    {
      title: 'Room Number',
      align: 'center',
      dataIndex: 'Address_Customer',
      key: 'Address_Customer',
      width: '10%',

      sorter: (a, b) =>
        a.Address_Customer !== undefined
          ? a.Address_Customer.localeCompare(b.Address_Customer)
          : null,

      render: (text) => (
        <Highlighter
          highlightStyle={{ backgroundColor: '#D8AA81', padding: 0 }}
          searchWords={
            paramsBilling.filters.Address_Customer !== null
              ? paramsBilling.filters.Address_Customer
              : ['']
          }
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ),
    },
    {
      title: 'Name Owner',
      align: 'center',
      dataIndex: 'Name_Customer',
      key: 'Name_Customer',
      width: '10%',
      sorter: (a, b) =>
        a.Name_Customer !== undefined
          ? a.Name_Customer.localeCompare(b.Name_Customer)
          : null,
    },
    {
      title: 'Due Date',
      align: 'center',
      dataIndex: 'action',
      key: 'BillsPayment_Invoice',
      width: '10%',
      render: (text, record) => (
        <Space size="middle">
          <a>
            {moment(record.BillsPayment_Date_Start).format('DD/MM/YYYY')} -{' '}
            {moment(record.BillsPayment_Date_End).format('DD/MM/YYYY')}
          </a>
        </Space>
      ),
    },

    {
      title: 'Total',
      align: 'center',
      dataIndex: 'Total_BillsPayment',
      key: 'Total_BillsPayment',
      width: '10%',

      sorter: (a, b) =>
        a.Total_BillsPayment !== undefined
          ? a.Total_BillsPayment - b.Total_BillsPayment
          : null,
    },
    {
      title: 'Status',
      align: 'center',
      dataIndex: 'BillsPayment_Status',
      key: 'BillsPayment_Status',
      width: '10%',
      render: (BillsPayment_Status) => {
        return <Tag color="orange">{BillsPayment_Status}</Tag>;
      },
    },
    {
      title: 'Create Bill',
      align: 'center',
      dataIndex: 'createdAt',
      key: 'createBill',
      width: '10%',

      sorter: (a, b) =>
        a.createdAt !== undefined
          ? a.createdAt.localeCompare(b.createdAt)
          : null,
    },

    {
      title: 'Action',
      align: 'center',
      dataIndex: 'action',
      key: 'BillsPayment_Invoice',
      width: '10%',
      render: (text, record) => (
        <>
          <Button
            value={record.BillsPayment_Invoice}
            type="Default"
            loading={Verify[record.BillsPayment_Invoice]}
            disabled={record.Receipt_Status}
            shape="round"
            onClick={approveBillingModal}
          >
            Verify
          </Button>
        </>
      ),
    },
  ];

  const waitForPayment = [
    {
      title: 'Invoice Bill',
      align: 'center',
      dataIndex: 'BillsPayment_Invoice',
      key: 'BillsPayment_Invoice',
      width: '10%',
      sorter: (a, b) =>
        a.BillsPayment_Invoice !== undefined
          ? a.BillsPayment_Invoice.localeCompare(b.BillsPayment_Invoice)
          : null,
    },
    {
      title: 'Room Number',
      align: 'center',
      dataIndex: 'Address_Customer',
      key: 'Address_Customer',
      width: '10%',
      render: (text) => (
        <Highlighter
          highlightStyle={{ backgroundColor: '#D8AA81', padding: 0 }}
          searchWords={
            paramsBilling.filters.Address_Customer !== null
              ? paramsBilling.filters.Address_Customer
              : ['']
          }
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ),
      sorter: (a, b) =>
        a.Address_Customer !== undefined
          ? a.Address_Customer.localeCompare(b.Address_Customer)
          : null,
    },
    {
      title: 'Name Owner',
      align: 'center',
      dataIndex: 'Name_Customer',
      key: 'Name_Customer',
      width: '10%',

      sorter: (a, b) =>
        a.Name_Customer !== undefined
          ? a.Name_Customer.localeCompare(b.Name_Customer)
          : null,
    },
    {
      title: 'Due Date',
      align: 'center',
      dataIndex: 'action',
      key: 'BillsPayment_Invoice',
      width: '10%',
      render: (text, record) => (
        <Space size="middle">
          <a>
            {moment(record.BillsPayment_Date_Start).format('DD/MM/YYYY')} -{' '}
            {moment(record.BillsPayment_Date_End).format('DD/MM/YYYY')}
          </a>
        </Space>
      ),
    },
    {
      title: 'Total',
      align: 'center',
      dataIndex: 'Total_BillsPayment',
      key: 'Total_BillsPayment',
      width: '10%',
      sorter: (a, b) =>
        a.Total_BillsPayment !== undefined
          ? a.Total_BillsPayment - b.Total_BillsPayment
          : null,
    },
    {
      title: 'Status',
      align: 'center',
      dataIndex: 'BillsPayment_Status',
      key: 'BillsPayment_Status',
      width: '10%',
      render: (BillsPayment_Status) => {
        switch (BillsPayment_Status) {
          case 'Payment successful':
            return <Tag color="green">{BillsPayment_Status}</Tag>;
            break;
          case 'Pending review':
            return <Tag color="orange">{BillsPayment_Status}</Tag>;
            break;
          case 'Wait for payment':
            return <Tag color="red">{BillsPayment_Status}</Tag>;
            break;
          default:
            return null;
        }
      },
    },
    {
      title: 'Create Bill',
      align: 'center',
      dataIndex: 'createdAt',
      key: 'createBill',
      width: '10%',

      sorter: (a, b) =>
        a.createdAt !== undefined
          ? a.createdAt.localeCompare(b.createdAt)
          : null,
    },
    {
      title: 'Detail',
      align: 'center',
      dataIndex: 'action',
      key: 'BillsPayment_Invoice',
      width: '10%',
      render: (text, record) => (
        <>
          <Button
            value={record.BillsPayment_Invoice}
            type="Default"
            shape="round"
            loading={View[record.BillsPayment_Invoice]}
            onClick={selectedRow}
          >
            View
          </Button>
        </>
      ),
    },
    {
      title: 'Action',
      align: 'center',
      dataIndex: 'action',
      key: 'BillsPayment_Invoice',
      width: '10%',
      render: (text, record) => (
        <>
          <Button
            danger
            value={record.id}
            type="Default"
            disabled={record.Receipt_Status}
            loading={Del[record.id]}
            shape="round"
            icon={<DeleteFilled style={{ verticalAlign: 'baseline' }} />}
            onClick={deleteBillingByID}
          >
            delete
          </Button>
        </>
      ),
    },
  ];

  const BillingNotGen = [
    {
      title: 'Room Number',
      align: 'center',
      dataIndex: 'address',
      key: 'address',
      width: '10%',
      render: (text) => (
        <Highlighter
          highlightStyle={{ backgroundColor: '#D8AA81', padding: 0 }}
          searchWords={
            paramsBilling.filters.Address_Customer !== null
              ? paramsBilling.filters.Address_Customer
              : ['']
          }
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ),
      sorter: (a, b) =>
        a.address !== undefined ? a.address.localeCompare(b.address) : null,
    },
    {
      title: 'Name Owner',
      align: 'center',
      dataIndex: 'fullname',
      key: 'fullname',
      width: '10%',
      sorter: (a, b) =>
        a.fullname !== undefined ? a.fullname.localeCompare(b.fullname) : null,
    },

    {
      title: 'ฺBilling of the month',
      align: 'center',
      dataIndex: 'status_billing',
      key: 'status_billing',
      width: '10%',
      render: (status_billing) => {
        return <Tag color="red">{moment().format('MMMM')}</Tag>;
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
          <Button
            value={record.address}
            type="Default"
            disabled={record.Receipt_Status}
            className="buttom_create"
            loading={loadingCreate[record.address]}
            shape="round"
            onClick={createBilling}
          >
            Create Invoice
          </Button>
        </>
      ),
    },
  ];
  const outDate = [
    {
      title: 'Invoice Bill',
      align: 'center',
      dataIndex: 'BillsPayment_Invoice',
      key: 'BillsPayment_Invoice',
      width: '10%',
      sorter: (a, b) =>
        a.BillsPayment_Invoice !== undefined
          ? a.BillsPayment_Invoice.localeCompare(b.BillsPayment_Invoice)
          : null,
    },
    {
      title: 'Room Number',
      align: 'center',
      dataIndex: 'Address_Customer',
      key: 'Address_Customer',
      width: '10%',
      render: (text) => (
        <Highlighter
          highlightStyle={{ backgroundColor: '#D8AA81', padding: 0 }}
          searchWords={
            paramsBilling.filters.Address_Customer !== null
              ? paramsBilling.filters.Address_Customer
              : ['']
          }
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ),
      sorter: (a, b) =>
        a.Address_Customer !== undefined
          ? a.Address_Customer.localeCompare(b.Address_Customer)
          : null,
    },
    {
      title: 'Name Owner',
      align: 'center',
      dataIndex: 'Name_Customer',
      key: 'Name_Customer',
      width: '10%',

      sorter: (a, b) =>
        a.Name_Customer !== undefined
          ? a.Name_Customer.localeCompare(b.Name_Customer)
          : null,
    },
    {
      title: 'Due Date',
      align: 'center',
      dataIndex: 'action',
      key: 'BillsPayment_Invoice',
      width: '10%',
      render: (text, record) => (
        <Space size="middle">
          <a>
            {moment(record.BillsPayment_Date_Start).format('DD/MM/YYYY')} -{' '}
            {moment(record.BillsPayment_Date_End).format('DD/MM/YYYY')}
          </a>
        </Space>
      ),
    },
    {
      title: 'Total',
      align: 'center',
      dataIndex: 'Total_BillsPayment',
      key: 'Total_BillsPayment',
      width: '10%',
      sorter: (a, b) =>
        a.Total_BillsPayment !== undefined
          ? a.Total_BillsPayment - b.Total_BillsPayment
          : null,
    },
    {
      title: 'Status',
      align: 'center',
      dataIndex: 'BillsPayment_Status',
      key: 'BillsPayment_Status',
      width: '10%',
      render: (BillsPayment_Status) => {
        return <Tag color="gray">{BillsPayment_Status}</Tag>;
      },
    },
    {
      title: 'Create Bill',
      align: 'center',
      dataIndex: 'createdAt',
      key: 'createBill',
      width: '10%',
      sorter: (a, b) =>
        a.createdAt !== undefined
          ? a.createdAt.localeCompare(b.createdAt)
          : null,
    },
    {
      title: 'Detail',
      align: 'center',
      dataIndex: 'action',
      key: 'BillsPayment_Invoice',
      width: '10%',
      render: (text, record) => (
        <>
          <Button
            value={record.BillsPayment_Invoice}
            type="Default"
            shape="round"
            onClick={selectedRow}
          >
            View
          </Button>
        </>
      ),
    },
  ];

  const reject = [
    {
      title: 'Invoice Bill',
      align: 'center',
      dataIndex: 'BillsPayment_Invoice',
      key: 'BillsPayment_Invoice',
      width: '10%',
      sorter: (a, b) =>
        a.BillsPayment_Invoice !== undefined
          ? a.BillsPayment_Invoice.localeCompare(b.BillsPayment_Invoice)
          : null,
    },
    {
      title: 'Room Number',
      align: 'center',
      dataIndex: 'Address_Customer',
      key: 'Address_Customer',
      width: '10%',
      render: (text) => (
        <Highlighter
          highlightStyle={{ backgroundColor: '#D8AA81', padding: 0 }}
          searchWords={
            paramsBilling.filters.Address_Customer !== null
              ? paramsBilling.filters.Address_Customer
              : ['']
          }
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ),
      sorter: (a, b) =>
        a.Address_Customer !== undefined
          ? a.Address_Customer.localeCompare(b.Address_Customer)
          : null,
    },
    {
      title: 'Name Owner',
      align: 'center',
      dataIndex: 'Name_Customer',
      key: 'Name_Customer',
      width: '10%',

      sorter: (a, b) =>
        a.Name_Customer !== undefined
          ? a.Name_Customer.localeCompare(b.Name_Customer)
          : null,
    },
    {
      title: 'Due Date',
      align: 'center',
      dataIndex: 'action',
      key: 'BillsPayment_Invoice',
      width: '10%',
      render: (text, record) => (
        <Space size="middle">
          <a>
            {moment(record.BillsPayment_Date_Start).format('DD/MM/YYYY')} -{' '}
            {moment(record.BillsPayment_Date_End).format('DD/MM/YYYY')}
          </a>
        </Space>
      ),
    },
    {
      title: 'Total',
      align: 'center',
      dataIndex: 'Total_BillsPayment',
      key: 'Total_BillsPayment',
      width: '10%',
      sorter: (a, b) =>
        a.Total_BillsPayment !== undefined
          ? a.Total_BillsPayment - b.Total_BillsPayment
          : null,
    },
    {
      title: 'Status',
      align: 'center',
      dataIndex: 'BillsPayment_Status',
      key: 'BillsPayment_Status',
      width: '10%',
      render: (BillsPayment_Status) => {
        return <Tag color="warning">{BillsPayment_Status}</Tag>;
      },
    },
    {
      title: 'Create Bill',
      align: 'center',
      dataIndex: 'createdAt',
      key: 'createBill',
      width: '10%',
      sorter: (a, b) =>
        a.createdAt !== undefined
          ? a.createdAt.localeCompare(b.createdAt)
          : null,
    },
    {
      title: 'Action',
      align: 'center',
      dataIndex: 'action',
      key: 'BillsPayment_Invoice',
      width: '10%',
      render: (text, record) => (
        <>
          <Button
            value={record.BillsPayment_Invoice}
            type="Default"
            loading={VerifyReject[record.BillsPayment_Invoice]}
            disabled={record.Receipt_Status}
            shape="round"
            onClick={approveBillingModalReject}
          >
            View
          </Button>
        </>
      ),
    },
  ];

  return (
    <div>
      {(() => {
        switch (status_billing) {
          case 'Pending review':
            columns = PendingReview;
            break;
          case 'Bill not generated':
            columns = BillingNotGen;
            break;
          case 'Wait for payment':
            columns = waitForPayment;
            break;
          case 'Out Date':
            columns = outDate;
            break;
          case 'Payment annotation':
            columns = reject;
            break;
          default:
            break;
        }
      })()}
      <Table
        // onRow={selectedRow}
        columns={columns}
        loading={loadingTable}
        pagination={PaginationConfig}
        onChange={handleTableChange}
        dataSource={dataBilling}
      />
      <ModalExportBilling paymentDetail={state.paymentDetail} />
      <ModalPendingBill />
      <ModalReject />
    </div>
  );
};
