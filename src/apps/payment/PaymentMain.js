import React from 'react';
import { Input, DatePicker } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { PaymentTable } from "./components/PaymentTable";
import {getBillingPayment,getCustomerList,} from './services/thunk-action/payment_thunk';
import { MenuBillPayment } from './components/MenuBillPayment';
import CreateBillModal from './components/Modal/ModalCreateBill';
import { encryptStorage } from '../../utils/encryptStorage';
import './style/payment.css';
import Header from '../../components/Header';
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY/MM/DD';
const monthFormat = moment().format();
const nextDate = moment(monthFormat, dateFormat).add(30, 'days');

let width = window.innerWidth;
let height = window.innerHeight;

const PaymentMain = () => {
  const session = encryptStorage.getItem('user_session');
  const dispatch = useDispatch();
  const { status_billing, dataBilling, paramsBilling } = useSelector(
    (state) => state.PaymentActionRedux
  );
  // export all payment
  // const exportBillingModal = async () => {
  //     dispatch({type: "EXPORT_ALL_DATABILLING", payload: dataBilling});
  //     dispatch({type: "CHANGE_STATE_EXPORT_BILLING", payload: true});
  // };
  // export all payment

  // search data table
  const filterData = async ({ currentTarget }) => {
    if (currentTarget.value.length > 0) {
      if (
        paramsBilling.filters !== undefined &&
        paramsBilling.filters !== null
      ) {
        paramsBilling.filters = {
          BillsPayment_Invoice: [currentTarget.value],
          Address_Customer: [currentTarget.value],
        };
        if (status_billing === 'Bill not generated') {
          dispatch(getCustomerList(paramsBilling));
        } else {
          dispatch(getBillingPayment(paramsBilling));
        }
      } else {
        paramsBilling.filters = {
          BillsPayment_Invoice: [currentTarget.value],
          Address_Customer: [currentTarget.value],
        };
      }
    } else {
      paramsBilling.filters = {
        BillsPayment_Invoice: null,
        Address_Customer: null,
      };
      if (status_billing === 'Bill not generated') {
        dispatch(getCustomerList(paramsBilling));
      } else {
        dispatch(getBillingPayment(paramsBilling));
      }
    }
  };

  // search data table
  function onChange(date, dateString) {
    console.log(date, dateString);
  }

  return (
    <>
      <Header title="Payment" />
      <div style={{ paddingTop: 30 }}></div>
      <div className="row">
        {status_billing !== 'Bill not generated' ? (
          <div className="col-4"></div>
        ) : null}
        <div className="col-6">
          <div className="payment_custom">
            <Input
              placeholder={`Search Room Number`}
              onChange={(e) => {
                filterData(e);
              }}
              prefix={<SearchOutlined />}
            />
          </div>
        </div>
      </div>
      <CreateBillModal dataCreateBilling={null} />
      <MenuBillPayment />
      <PaymentTable />
    </>
  );
};

export default PaymentMain;
