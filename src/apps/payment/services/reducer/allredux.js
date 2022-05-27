import { combineReducers } from 'redux';
import { PaymentActionRedux } from './payment_reducer';
import { BuildProgressActionRedux } from './buildProgress_reducer';
import { EMSActionRedux } from './ems_reducer';
import { WarrantyActionRedux } from './warranty_reducer';

const allRedux = combineReducers({ PaymentActionRedux, BuildProgressActionRedux, EMSActionRedux, WarrantyActionRedux });
export { allRedux };
