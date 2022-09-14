import { combineReducers } from 'redux'
import {
  PaymentActionRedux,
} from './paymentReducer.js'
import { FixReportActionRedux } from './fixReportReducer'
import { AuthReducer } from './AuthReducer'

const AppReducers = combineReducers({ AuthReducer, PaymentActionRedux,FixReportActionRedux })
export { AppReducers }
