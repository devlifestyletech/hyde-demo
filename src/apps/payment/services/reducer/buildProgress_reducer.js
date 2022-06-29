const billingPaymentData = {
    status: false,
    statusExportBilling: false,
    dataBillingAllExport: null,
    dataBillingAllApprove: null,
    dataBuilding: [],
    dataCreateBilling: null,
    count: 3,
    dataSize:0,
    paramsBuildingProgress:null,
    alert_notification: null,
    status_billing: null,
    statusModalPending: false,
    statusModalEdit: false,
    dataEdit:null,
    headerMenu: null,
    loadingBuilding:false
};
//bp=bui
const BuildProgressActionRedux = (state = billingPaymentData, action) => {
    switch (action.type) {
        case "CHANGE_STATUS_BILLING":
            return {...state, status_billing: action.payload};
        case "CHANGE_PARAMS_BUILD":
            return {...state, paramsBuildingProgress: action.payload};
        case "DISPLAY_DATA_BUILDING":
            return {...state, dataBuilding: action.payload};
        case "EXPORT_ALL_DATABILLING":
            return {...state, dataBillingAllExport: action.payload};
        case "CHANGE_STATE_BUILDING":
            return {...state, status: action.payload};
        case "CHANGE_DATA_SIZE_BUILD":
            return {...state, dataSize: action.payload};
        case "CHANGE_STATE_EXPORT_BILLING":
            return {...state, statusExportBilling: action.payload};
        case "ENABLE_ALERT":
            return {...state, alert_notification: action.payload};
        case "MODAL_PENDING":
            return {...state, statusModalPending: action.payload};
        case "MODAL_EDIT":
            return {...state, statusModalEdit: !state.statusModalEdit};
        case "LOADING_BUILD":
            return {...state, loadingBuilding: !state.loadingBuilding};
        case "CHANGE_STATE_EXPORT_APPROVE":
            return {...state, dataBillingAllApprove: action.payload};
        case "CHANGE_STATE_MENU_PAYMENT":
            return {...state, count: action.payload};
        case "CREATE_BILLING":
            return {...state, dataCreateBilling: action.payload};
        case "CHANGE_COUNT":
            return {...state, count: action.payload};
        case "MENU_NAME_HEADER":
            return {...state, headerMenu: action.payload};
        case "EDIT_BUILDINGPROGRESS":
            return {...state, dataEdit: action.payload};
        default:
            return state;
    }
};
export {BuildProgressActionRedux};
