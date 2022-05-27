/* eslint-disable no-sequences */
/* eslint-disable no-unreachable */
/* eslint-disable no-unused-expressions */
import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Tag, Modal, notification, Row, Col } from 'antd';
import { DeleteFilled, ExclamationCircleOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import ModalExportBilling from './Modal/ModalExportBilling';
import ModalPendingBill from './Modal/ModalPending';
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
import logo from '../assets/images/hyde-logo.svg';
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
  } = useSelector((state) => state.PaymentActionRedux);
  const dispatch = useDispatch();
  // eslint-disable-next-line no-unused-vars
  const [state, setPayment] = useState(statePayment);
  const [loadingCreate, setloadingCreate] = useState(false);
  useEffect(() => {
    dispatch({ type: 'CHANGE_PARAMS_BILLING', payload: paramsBillingPayment });
    dispatch(getBillingPayment(paramsBillingPayment));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // setting pagination Option
  const pageSizeOptions = ['5', '20', '30', '40'];
  const PaginationConfig = {
    defaultPageSize: pageSizeOptions[0],
    pageSizeOptions: pageSizeOptions,
    current: pageDefault,
    showSizeChanger: true,
    total: dataSize,
  };
  const paramsBillingPayment = {
    status: 'Payment successfull',
    defaultPage: 1,
    sorter: undefined,
    filters: {
      Address_Customer: null,
      BillsPayment_Invoice: null,
    },
    pagesize: PaginationConfig.defaultPageSize,
  };

  // setting pagination Option

  const exportBillingModal = async ({ currentTarget }) => {
    const result = dataBilling.filter((e) => {
      return e.BillsPayment_Invoice === currentTarget.value;
    });

    dispatch({ type: 'EXPORT_ALL_DATABILLING', payload: result });
    dispatch({ type: 'CHANGE_STATE_EXPORT_BILLING', payload: true });
  };

  // approve
  const approveBillingModal = async ({ currentTarget }) => {
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
  };
  //approve

  // showDetail
  const selectedRow = ({ currentTarget }) => {
    const result = dataBilling.filter((e) => {
      return e.BillsPayment_Invoice === currentTarget.value;
    });
    if (status_billing !== 'Bill not generated') {
      Modal.info({
        title: 'Billing Payment Detail',
        width: '45%',
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
                                  width: '10vw',
                                  marginTop: '6%',
                                  marginLeft: '10%',
                                }}
                                alt="logo"
                              />
                            </div>
                          </Col>
                          <Col span={12}>
                            <div
                              className="col-8"
                              style={{ textAlign: 'left' }}
                            >
                              <h3 style={{ margin: '4%' }}>
                                Hyde Heritage at Thonglor Condominium Juristic
                                Person 1199 Sukhumvit Rd., Klongton Nua,
                                Wattana, Bangkok, 10110 Tel. 0987645822
                              </h3>
                            </div>
                          </Col>
                        </Row>

                        <Row style={{ paddingBottom: '2vh' }}>
                          <Col
                            span={12}
                            style={{
                              textAlign: 'left',
                              paddingLeft: '5%',
                            }}
                          >
                            <text>
                              Invoice Bill: {e?.BillsPayment_Invoice}
                              <br />
                              Tax number: 0012254
                              <br />
                              Name Owner: {e?.Name_Customer}
                              <br />
                              Address: {e?.Address_Customer}
                              <br />
                            </text>
                          </Col>
                          <Col
                            span={12}
                            style={{
                              textAlign: 'left',
                              paddingLeft: '2%',
                            }}
                          >
                            <text>
                              Due Date
                              <br />
                              From : {e?.BillsPayment_Date_Start}
                              <br />
                              To : {e?.BillsPayment_Date_End}
                              <br />
                              {/* Issued by: Admin2*/}
                              Create on : {e?.BillsPayment_Date_Start}
                              <br />
                            </text>
                          </Col>
                        </Row>

                        <div className="container-fluid">
                          <table>
                            <tr>
                              <th
                                style={{
                                  backgroundColor: '#B8B8B8',
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
                                  width: '30%',
                                  textAlign: 'center',
                                }}
                              >
                                Detail
                              </th>
                              <th
                                style={{
                                  backgroundColor: '#B8B8B8',
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
                                      }}
                                    >
                                      <td>{j + 1}</td>
                                      <td>{f.subBilling}</td>
                                      <td>{f.amount}</td>
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
                              paddingTop: '2vh',
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
                                outda
                                <br />
                                <h3>
                                  Grand Total:
                                  <br />
                                </h3>
                              </Col>
                              <Col span={4} style={{ textAlign: 'left' }}>
                                {e?.Total_BillsPayment}
                                <br />
                                0 <br />
                                <h3>
                                  {e?.Total_BillsPayment}
                                  <br />
                                </h3>
                              </Col>
                              <Col span={2} style={{ textAlign: 'left' }}>
                                {' '}
                                THB.
                                <br />
                                THB.
                                <br />
                                <h3>
                                  {' '}
                                  THB.
                                  <br />
                                </h3>
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
        onOk() {},
      });
    }
  };
  // showDetail

  //delete billingPayment
  const deleteBillingByID = ({ currentTarget }) => {
    Modal.confirm({
      title: 'Are you sure delete billing payment',
      icon: <ExclamationCircleOutlined />,
      content: ` payment id ${currentTarget.value} ?`,
      okText: 'Yes',
      async onOk() {
        await deleteID(currentTarget.value);
      },
      cancelText: 'No',
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
    await setloadingCreate(true);
    const [result] = dataBilling.filter((e) => {
      return e.address === currentTarget.value;
    });
    const dataOutdate = await getOutDate(currentTarget.value);
    if (dataOutdate.length > 0) {
      dataOutdate.map((e) => {
        return (total += parseFloat(e.Total_BillsPayment));
      });
      result.totalCost = total;
      result.Cost = 'Overdue';
    } else {
      result.totalCost = null;
      result.Cost = null;
    }
    console.log('createBilling:', dataOutdate);
    await dispatch({ type: 'CREATE_BILLING', payload: result });
    dispatch({ type: 'CHANGE_STATE', payload: true });
    await setloadingCreate(false);
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
      BillsPayment_Invoice:
        filters?.BillsPayment_Invoice !== undefined
          ? filters?.BillsPayment_Invoice
          : null,
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
      render: (text) => (
        <Highlighter
          highlightStyle={{ backgroundColor: '#D8AA81', padding: 0 }}
          searchWords={
            paramsBilling.filters.BillsPayment_Invoice !== null
              ? paramsBilling.filters.BillsPayment_Invoice
              : ['']
          }
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ),
      sorter: (a, b) =>
        a.BillsPayment_Invoice.localeCompare(b.BillsPayment_Invoice),
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
      sorter: (a, b) => a.Address_Customer.localeCompare(b.Address_Customer),
    },
    {
      title: 'Name Owner',
      align: 'center',
      dataIndex: 'Name_Customer',
      key: 'Name_Customer',
      width: '10%',

      sorter: (a, b) => a.Address_Customer.localeCompare(b.Address_Customer),
    },
    {
      title: 'Due Date',
      align: 'center',
      dataIndex: 'action',
      key: 'BillsPayment_Invoice',
      width: '10%',
      render: (text, record) => (
        <Space size="middle">
          <Button type="link">
            {moment(record.BillsPayment_Date_Start).format('DD/MM/YYYY')} -{' '}
            {moment(record.BillsPayment_Date_End).format('DD/MM/YYYY')}
          </Button>
        </Space>
      ),
    },
    {
      title: 'Total',
      align: 'center',
      dataIndex: 'Total_BillsPayment',
      key: 'Total_BillsPayment',
      width: '10%',

      sorter: (a, b) => a.Total_BillsPayment - b.Total_BillsPayment,
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

      sorter: (a, b) => a.createdAt.localeCompare(b.createdAt),
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
      render: (text) => (
        <Highlighter
          highlightStyle={{ backgroundColor: '#D8AA81', padding: 0 }}
          searchWords={
            paramsBilling.filters.BillsPayment_Invoice !== null
              ? paramsBilling.filters.BillsPayment_Invoice
              : ['']
          }
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ),
      sorter: (a, b) =>
        a.BillsPayment_Invoice.localeCompare(b.BillsPayment_Invoice),
    },
    {
      title: 'Room Number',
      align: 'center',
      dataIndex: 'Address_Customer',
      key: 'Address_Customer',
      width: '10%',

      sorter: (a, b) => a.Address_Customer.localeCompare(b.Address_Customer),

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
      sorter: (a, b) => a.Name_Customer.localeCompare(b.Name_Customer),
    },
    {
      title: 'Due Date',
      align: 'center',
      dataIndex: 'action',
      key: 'BillsPayment_Invoice',
      width: '10%',
      render: (text, record) => (
        <Space size="middle">
          <Button type="link">
            {moment(record.BillsPayment_Date_Start).format('DD/MM/YYYY')} -{' '}
            {moment(record.BillsPayment_Date_End).format('DD/MM/YYYY')}
          </Button>
        </Space>
      ),
    },

    {
      title: 'Total',
      align: 'center',
      dataIndex: 'Total_BillsPayment',
      key: 'Total_BillsPayment',
      width: '10%',

      sorter: (a, b) => a.Total_BillsPayment - b.Total_BillsPayment,
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

      sorter: (a, b) => a.createdAt.localeCompare(b.createdAt),
    },

    {
      title: 'Action',
      dataIndex: 'action',
      key: 'BillsPayment_Invoice',
      width: '10%',
      render: (text, record) => (
        <>
          <Button
            value={record.BillsPayment_Invoice}
            type="Default"
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
      render: (text) => (
        <Highlighter
          highlightStyle={{ backgroundColor: '#D8AA81', padding: 0 }}
          searchWords={
            paramsBilling.filters.BillsPayment_Invoice !== null
              ? paramsBilling.filters.BillsPayment_Invoice
              : ['']
          }
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ),
      sorter: (a, b) =>
        a.BillsPayment_Invoice.localeCompare(b.BillsPayment_Invoice),
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
      sorter: (a, b) => a.Address_Customer.localeCompare(b.Address_Customer),
    },
    {
      title: 'Name Owner',
      align: 'center',
      dataIndex: 'Name_Customer',
      key: 'Name_Customer',
      width: '10%',

      sorter: (a, b) => a.Name_Customer.localeCompare(b.Name_Customer),
    },
    {
      title: 'Due Date',
      align: 'center',
      dataIndex: 'action',
      key: 'BillsPayment_Invoice',
      width: '10%',
      render: (text, record) => (
        <Space size="middle">
          <Button type="link">
            {moment(record.BillsPayment_Date_Start).format('DD/MM/YYYY')} -{' '}
            {moment(record.BillsPayment_Date_End).format('DD/MM/YYYY')}
          </Button>
        </Space>
      ),
    },
    {
      title: 'Total',
      align: 'center',
      dataIndex: 'Total_BillsPayment',
      key: 'Total_BillsPayment',
      width: '10%',
      sorter: (a, b) => a.Total_BillsPayment - b.Total_BillsPayment,
    },
    {
      title: 'Status',
      align: 'center',
      dataIndex: 'BillsPayment_Status',
      key: 'BillsPayment_Status',
      width: '10%',
      render: (BillsPayment_Status) => {
        switch (BillsPayment_Status) {
          case 'Payment successfull':
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

      sorter: (a, b) => a.createdAt.localeCompare(b.createdAt),
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
      sorter: (a, b) => a.address.localeCompare(b.address),
    },
    {
      title: 'Name Owner',
      align: 'center',
      dataIndex: 'fullname',
      key: 'fullname',
      width: '10%',

      sorter: (a, b) => a.fullname.localeCompare(b.fullname),
    },

    {
      title: 'ฺBilling of the month',
      align: 'center',
      dataIndex: 'status_billing',
      key: 'status_billing',
      width: '10%',
      render: () => {
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
            // icon={<PlusOutlined style={{ verticalAlign: "baseline" }} />}
            className="buttom_create"
            loading={loadingCreate}
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
      render: (text) => (
        <Highlighter
          highlightStyle={{ backgroundColor: '#D8AA81', padding: 0 }}
          searchWords={
            paramsBilling.filters.BillsPayment_Invoice !== null
              ? paramsBilling.filters.BillsPayment_Invoice
              : ['']
          }
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ),
      sorter: (a, b) =>
        a.BillsPayment_Invoice.localeCompare(b.BillsPayment_Invoice),
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
      sorter: (a, b) => a.Address_Customer.localeCompare(b.Address_Customer),
    },
    {
      title: 'Name Owner',
      align: 'center',
      dataIndex: 'Name_Customer',
      key: 'Name_Customer',
      width: '10%',

      sorter: (a, b) => a.Name_Customer.localeCompare(b.Name_Customer),
    },
    {
      title: 'Due Date',
      align: 'center',
      dataIndex: 'action',
      key: 'BillsPayment_Invoice',
      width: '10%',
      render: (text, record) => (
        <Space size="middle">
          <Button type="link">
            {moment(record.BillsPayment_Date_Start).format('DD/MM/YYYY')} -{' '}
            {moment(record.BillsPayment_Date_End).format('DD/MM/YYYY')}
          </Button>
        </Space>
      ),
    },
    {
      title: 'Total',
      align: 'center',
      dataIndex: 'Total_BillsPayment',
      key: 'Total_BillsPayment',
      width: '10%',
      sorter: (a, b) => a.Total_BillsPayment - b.Total_BillsPayment,
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
      sorter: (a, b) => a.createdAt.localeCompare(b.createdAt),
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
    </div>
  );
};
