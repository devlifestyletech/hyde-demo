const EMSData = {
    statusCreateEMS: false,
    statusEditEMS: false,
    dataBillingAllExport: null,
    dataEMSEdit: null,
    dataEMS: [],
    paramsEMS :null,
    dataCreateBilling: null,
    loadingTable:false,
    count: 0,
    dataSize:0,
    alert_notification: null,
    status_billing: null,
    statusModalPending: false,
};

const EMSActionRedux = (state = EMSData, action) => {
    switch (action.type) {
        case "CHANGE_LOADING_TABLE_EMS":
           return {...state,loadingTable:!state.loadingTable}
        case "CHANGE_PARAMS_EMS":
            return {...state, paramsEMS: action.payload};
            case "CHANGE_STATUS_BILLING":
                return {...state, status_billing: action.payload};
            case "CHANGE_DATA_SIZE":
                return {...state, dataSize: action.payload};
        case "DISPLAY_DATATABLE_EMS":
            return {...state, dataEMS: action.payload};
        case "EXPORT_ALL_DATABILLING":
            return {...state, dataBillingAllExport: action.payload};
        case "CREATE_MODAL_EMS":
            return {...state, statusCreateEMS:!state.statusCreateEMS};
        case "EDIT_EMS":
            return {...state, statusEditEMS: !state.statusEditEMS};
        case "ENABLE_ALERT":
            return {...state, alert_notification: action.payload};
        case "MODAL_PENDING":
            return {...state, statusModalPending: action.payload};
        case "DATA_EDIT_EMS":
            return {...state, dataEMSEdit: action.payload};
        case "CHANGE_STATE_MENU_PAYMENT":
            return {...state, count: action.payload};
        case "CREATE_BILLING":
            return {...state, dataCreateBilling: action.payload};
        case "CHANGE_COUNT":
            return {...state, count: action.payload};
        default:
            return state;
    }
};
export {EMSActionRedux};
