
import {GetBillinglist,addressCustomer,GetCountBillinglist,getDataPaymentDashboard,getCountaddressCustomer} from '../API/payment_api'
import {paymentQuery,CustomerQuery,paymentDashboardQuery} from './payment_query'
const getBillingPayment = (params) =>{
    return async (dispatch) => {
        const resultParams=await paymentQuery(params)
        console.log("getBillingPayment:",params);
        if (resultParams.status) {
            dispatch({type:"CHANGE_LOADING_TABLE"})
            const count = await GetCountBillinglist(resultParams.content)
            // eslint-disable-next-line no-unused-expressions
            count !== undefined ? dispatch({type:"CHANGE_DATA_SIZE",payload:count}):0
            const data = await GetBillinglist(resultParams.content)
            console.log("GetBillinglist:",data);
            if (data !== undefined) {

                dispatch({
                    payload:data ,
                    type:"DISPLAY_DATATABLE"
                });
                dispatch({type:"CHANGE_STATUS_BILLING",payload:params.status})
            } else {
                dispatch({
                    payload:[] ,
                    type:"DISPLAY_DATATABLE"
                });
            }
            dispatch({type:"CHANGE_LOADING_TABLE"})
        };
    }

}
const getCustomerList=(params) =>{
    return async (dispatch) => {
        const resultParams=await CustomerQuery(params)
        console.log("getCustomerList:",params);
        if (resultParams.status) {
            dispatch({type:"CHANGE_LOADING_TABLE"})
            const count = await getCountaddressCustomer(resultParams.content)
            const data = await addressCustomer(resultParams.content)
            if (data !== undefined) {
                // eslint-disable-next-line no-unused-expressions
                count !== undefined ? dispatch({type:"CHANGE_DATA_SIZE",payload:count}):0
                dispatch({
                    payload:data ,
                    type:"DISPLAY_DATATABLE"
                });
                dispatch({type:"CHANGE_STATUS_BILLING",payload:"Bill not generated"})
            } else {
    
            }
            dispatch({type:"CHANGE_LOADING_TABLE"})
        }
    };
}

const getDashboard=(params) =>{
   
    return async (dispatch) => {
        if (params!== undefined) {
            
            const resultParams=await paymentDashboardQuery(params)
                // eslint-disable-next-line no-unused-expressions
                if (resultParams.status) {
                const data = await getDataPaymentDashboard(resultParams.content)
                dispatch({
                    payload:data ,
                    type:"DISPLAY_DASHBOARD"
                });
            } else {
                dispatch({
                    payload:[] ,
                    type:"DISPLAY_DASHBOARD"
                });
            }
        } else {
            const data = await getDataPaymentDashboard()
            dispatch({
                payload:data ,
                type:"DISPLAY_DASHBOARD"
            });
        }
            
        }
    };

export {getBillingPayment,getCustomerList,getDashboard}
