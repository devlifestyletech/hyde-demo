import React from "react";
import {Input, DatePicker} from "antd";
import {SearchOutlined} from "@ant-design/icons";
import moment from "moment";
import {useDispatch, useSelector} from "react-redux";
import {Table_payment as TablePayment} from "./components/table_payment";
import {getBillingPayment, getCustomerList} from "./services/thunk-action/payment_thunk";
import {MenuBillPayment} from "./components/menuBillPayment";
import CreateBillModal from "./components/Modal/ModalCreateBill";
import "./style/payment.css";
import Heading from "../../components/Header";
// import io from "socket.io-client";
// const URL = "https://crud-firestore-swagger-node.herokuapp.com/"
// const URL ="http://localhost:8080/test"
// const socket = io.connect(URL);
// socket.on('notication',data =>{
//     console.log("datafromSocketio:",data);
// })
const {RangePicker} = DatePicker;
const dateFormat = "YYYY/MM/DD";
const monthFormat = moment().format();
const nextDate = moment(monthFormat, dateFormat).add(30, "days");

let width = window.innerWidth;
let height = window.innerHeight;

const Payment_success = () => {
    const dispatch = useDispatch();
    const {status_billing, dataBilling, paramsBilling} = useSelector(
        (state) => state.PaymentActionRedux
    );
    // export all payment
    // const exportBillingModal = async () => {
    //     dispatch({type: "EXPORT_ALL_DATABILLING", payload: dataBilling});
    //     dispatch({type: "CHANGE_STATE_EXPORT_BILLING", payload: true});
    // };
    // export all payment

    // search data table
    const filterData = async ({currentTarget}) => {
        if (currentTarget.value.length > 0) {
            if (
                paramsBilling.filters !== undefined &&
                paramsBilling.filters !== null
            ) {
                paramsBilling.filters = {
                    BillsPayment_Invoice: [currentTarget.value],
                    Address_Customer: [currentTarget.value],
                };
                if (status_billing === "Bill not generated") {
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
            if (status_billing === "Bill not generated") {
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
            <Heading title="Payment"/>
            <div style={{paddingTop:30}}>

            </div>
            <div className="row">
                {status_billing !== "Bill not generated" ? (
                    <div className="col-4">
                    </div>
                ) : null}
                <div className="col-6">
                    <div className="payment_custom">
                        <Input
                            placeholder={`Search Room Number`}
                            onChange={(e) => {
                                filterData(e);
                            }}
                            prefix={<SearchOutlined/>}
                        />
                    </div>
                </div>
            </div>
            <CreateBillModal dataCreateBilling={null}/>
            <MenuBillPayment/>
            <TablePayment/>

        </>
    );
};

export default Payment_success;
