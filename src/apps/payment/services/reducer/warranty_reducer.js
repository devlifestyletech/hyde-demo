const WarrantyData = {
	statusCreateWarranty: false,
	statusEditWarranty: false,
	dataBillingAllExport: null,
	dataEMSEdit: null,
	dataWarranty: [],
	paramsWarranty: null,
	dataCreateBilling: null,
	loadingTableWarranty: false,
	count: 0,
	dataSizeWarranty: 0,
	alert_notification: null,
	dataCreateWarranty: null,
	statusModalPending: false,
};

const WarrantyActionRedux = (state = WarrantyData, action) => {
	switch (action.type) {
		case 'CHANGE_LOADING_TABLE_WARRANTY':
			return { ...state, loadingTableWarranty: !state.loadingTableWarranty };
		case 'CHANGE_PARAMS_WARRANTY':
			return { ...state, paramsWarranty: action.payload };
		case 'DATA_CREATE_WARRANTY':
			return { ...state, dataCreateWarranty: action.payload };
		case 'CHANGE_DATA_SIZE_WARRANTY':
			return { ...state, dataSizeWarranty: action.payload };
		case 'DISPLAY_DATATABLE_WARRANTY':
			return { ...state, dataWarranty: action.payload };
		case 'EXPORT_ALL_DATABILLING':
			return { ...state, dataBillingAllExport: action.payload };
		case 'CREATE_MODAL_Warranty':
			return { ...state, statusCreateWarranty: !state.statusCreateWarranty };
		case 'EDIT_WARRANTY':
			return { ...state, statusEditWarranty: !state.statusEditWarranty };
		case 'ENABLE_ALERT':
			return { ...state, alert_notification: action.payload };
		case 'MODAL_PENDING':
			return { ...state, statusModalPending: action.payload };
		case 'DATA_EDIT_EMS':
			return { ...state, dataEMSEdit: action.payload };
		case 'CHANGE_STATE_MENU_PAYMENT':
			return { ...state, count: action.payload };
		case 'CREATE_BILLING':
			return { ...state, dataCreateBilling: action.payload };
		case 'CHANGE_COUNT':
			return { ...state, count: action.payload };
		default:
			return state;
	}
};
export { WarrantyActionRedux };
