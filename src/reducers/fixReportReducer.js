const fixReportData = {
    status: false,
    statusExportBilling: false,
    dataBillingAllExport: null,
    dataManageReport: null,
    dataFixReport: [],
    paramsFixReport :null,
    dataCreateBilling: null,
    loadingTable:false,
    count: 0,
    dataSize:0,
    pageDefault:1,
    loadingCreate:false,
    alert_notification: null,
    status_fixReport: null,
    statusModalFixReport: false,
    statusModalReject: false,
    dataPaymentDashboard:[],
    countFCMFixReport:0,
    countNotificationChat:0,
    focusChat:null
};

const FixReportActionRedux = (state = fixReportData, action) => {
    switch (action.type) {
        case "CHANGE_LOADING_TABLE_FIX_REPORT":
            return {...state,loadingTable:!state.loadingTable}
        case "CHANGE_PARAMS_FIX_REPORT":
            return {...state, paramsFixReport: action.payload};
        case "CHANGE_STATUS_FIX_REPORT":
            return {...state, status_fixReport: action.payload};
        case "CHANGE_DATA_SIZE_FIX_REPORT":
            return {...state, dataSize: action.payload};
        case "DISPLAY_DATATABLE_FIX_REPORT":
            return {...state, dataFixReport: action.payload};
            case "DISPLAY_DASHBOARD":
                return {...state, dataPaymentDashboard: action.payload};
        case "EXPORT_ALL_DATABILLING":
            return {...state, dataBillingAllExport: action.payload};
        case "CHANGE_STATE_FIX_REPORT":
            return {...state, status: action.payload};
        case "CHANGE_STATE_EXPORT_BILLING":
            return {...state, statusExportBilling: action.payload};
        case "ENABLE_ALERT":
            return {...state, alert_notification: action.payload};
        case "MODAL_FIX_REPORT":
            return {...state, statusModalFixReport: action.payload};
            case "MODAL_REJECT":
                return {...state, statusModalReject: action.payload};
        case "CHANGE_STATE_MANAGE_FIX_REPORT":
            return {...state, dataManageReport: action.payload};
        case "CREATE_BILLING":
            return {...state, dataCreateBilling: action.payload};
        case "CHANGE_COUNT_FIX_REPORT":
            return {...state, count: action.payload};
        case "CHANGE_PAGE_DEFAULT_FIX_REPORT":
            return {...state, pageDefault: action.payload};
        case "CHANGE_LOADING_CREATE":
            return {...state, loadingCreate: action.payload};
        case "CHANGE_FCM_COUNT_FIX_REPORT":
            return{...state,countFCMFixReport: action.payload}
        case "CHANGE_COUNT_NOTICATION_CHAT":
            return{...state,countNotificationChat: action.payload}
            case "CHANGE_CHAT_FOCUS":
                return{...state,focusChat: action.payload}
        default:
            return state;
    }
};
export {FixReportActionRedux};