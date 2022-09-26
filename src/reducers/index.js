import { combineReducers } from 'redux'
import { AuthReducer } from './AuthReducer'
import { FacilitiesManagementReducer } from './FacilitiesManagementReducer'
import { FixReportActionRedux } from './fixReportReducer'
import { PaymentActionRedux } from './paymentReducer.js'

const AppReducers = combineReducers(
  { AuthReducer, PaymentActionRedux, FixReportActionRedux, FacilitiesManagementReducer })
export { AppReducers }
