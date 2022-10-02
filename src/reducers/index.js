import { combineReducers } from 'redux'
import { AuthReducer } from './AuthReducer'
import { FacilitiesManagementReducer } from './FacilitiesManagementReducer'
import { FixReportActionRedux } from './FixReportReducer'
import { PaymentActionRedux } from './PaymentReducer'
import { ChatFixReportActionRedux } from './ChatReducer'

const AppReducers = combineReducers(
  { AuthReducer, PaymentActionRedux, FixReportActionRedux, FacilitiesManagementReducer,ChatFixReportActionRedux })
export { AppReducers }
