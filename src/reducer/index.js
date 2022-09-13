import { combineReducers } from 'redux'
import {
  FacilityManagementReducer,
} from '../apps/facility_management/services/reducer'
import {
  PaymentActionRedux,
} from '../apps/payment/services/reducer/payment_reducer'
import { AuthReducer } from './AuthReducer'

const AppReducers = combineReducers(
  { PaymentActionRedux, FacilityManagementReducer, AuthReducer })

export { AppReducers }
