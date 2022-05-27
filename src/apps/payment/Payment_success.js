import React from 'react';
import { Input, DatePicker } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { Table_payment as TablePayment } from './components/table_payment';
import { getBillingPayment, getCustomerList } from './services/thunk-action/payment_thunk';
import { MenuBillPayment } from './components/menuBillPayment';
import CreateBillModal from './components/Modal/ModalCreateBill';
import './style/payment.css';
import Heading from '../../components/Header';

const Payment_success = () => {
	const dispatch = useDispatch();
	const { status_billing, paramsBilling } = useSelector((state) => state.PaymentActionRedux);

	// search data table
	const filterData = async ({ currentTarget }) => {
		if (currentTarget.value.length > 0) {
			if (paramsBilling.filters !== undefined && paramsBilling.filters !== null) {
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

	return (
		<>
			<Heading title='Payment' />
			<div style={{ paddingTop: 30 }}></div>
			<div className='row'>
				{status_billing !== 'Bill not generated' ? <div className='col-4'></div> : null}
				<div className='col-6'>
					<div className='payment_custom'>
						<Input
							placeholder={`Search Invoice Bill , Room Number`}
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
			<TablePayment />
		</>
	);
};

export default Payment_success;
