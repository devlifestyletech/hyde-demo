import { combineReducers } from 'redux'
import {
  PaymentActionRedux,
} from '../apps/payment/services/reducer/payment_reducer'
import { AuthReducer } from './AuthReducer'

const AppReducers = combineReducers({ AuthReducer, PaymentActionRedux })
export { AppReducers }
