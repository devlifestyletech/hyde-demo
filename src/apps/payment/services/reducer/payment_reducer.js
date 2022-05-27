const billingPaymentData = {
	status: false,
	statusExportBilling: false,
	dataBillingAllExport: null,
	dataBillingAllApprove: null,
	dataBilling: [],
	paramsBilling: null,
	dataCreateBilling: null,
	loadingTable: false,
	count: 3,
	dataSize: 0,
	pageDefault: 1,
	loadingCreate: false,
	alert_notification: null,
	status_billing: null,
	statusModalPending: false,
};

const PaymentActionRedux = (state = billingPaymentData, action) => {
	switch (action.type) {
		case 'CHANGE_LOADING_TABLE':
			return { ...state, loadingTable: !state.loadingTable };
		case 'CHANGE_PARAMS_BILLING':
			return { ...state, paramsBilling: action.payload };
		case 'CHANGE_STATUS_BILLING':
			return { ...state, status_billing: action.payload };
		case 'CHANGE_DATA_SIZE':
			return { ...state, dataSize: action.payload };
		case 'DISPLAY_DATATABLE':
			return { ...state, dataBilling: action.payload };
		case 'EXPORT_ALL_DATABILLING':
			return { ...state, dataBillingAllExport: action.payload };
		case 'CHANGE_STATE':
			return { ...state, status: action.payload };
		case 'CHANGE_STATE_EXPORT_BILLING':
			return { ...state, statusExportBilling: action.payload };
		case 'ENABLE_ALERT':
			return { ...state, alert_notification: action.payload };
		case 'MODAL_PENDING':
			return { ...state, statusModalPending: action.payload };
		case 'CHANGE_STATE_EXPORT_APPROVE':
			return { ...state, dataBillingAllApprove: action.payload };
		case 'CHANGE_STATE_MENU_PAYMENT':
			return { ...state, count: action.payload };
		case 'CREATE_BILLING':
			return { ...state, dataCreateBilling: action.payload };
		case 'CHANGE_COUNT':
			return { ...state, count: action.payload };
		case 'CHANGE_PAGE_DEFAULT':
			return { ...state, pageDefault: action.payload };
		case 'CHANGE_LOADING_CREATE':
			return { ...state, loadingCreate: action.payload };
		default:
			return state;
	}
};
export { PaymentActionRedux };
