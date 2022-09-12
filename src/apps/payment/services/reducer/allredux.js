import {combineReducers} from 'redux'
import { PaymentActionRedux } from "./payment_reducer"
// eslint-disable-next-line no-undef
const allRedux=combineReducers({PaymentActionRedux,BuildProgressActionRedux,EMSActionRedux,WarrantyActionRedux})
export{allRedux }
