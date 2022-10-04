const chatFixReporttData = {
    countAll:0,
    countPending:0, 
    countRepairing:0,
    countSuccess:0,
    openModal:false
};

const ChatFixReportActionRedux = (state = chatFixReporttData, action) => {
    switch (action.type) {
        case "CHANGE_COUNT_ALL":
            return{...state,countAll: action.payload}
        case "CHANGE_COUNT_PENDING":
            return{...state,countPending: action.payload}
        case "CHANGE_COUNT_REPAIRING":
            return{...state,countRepairing: action.payload}
        case "CHANGE_COUNT_SUCCESS":
            return{...state,countSuccess: action.payload}
        case "CHANGE_OPEN_MODAL_FIXCHAT":
            return{...state,openModal: action.payload}
        default:
            return state;
    }
};
export {ChatFixReportActionRedux};