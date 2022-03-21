
import {getDataEMS,addressCustomer,getCountDataEMS} from '../API/EmergencyAPI'
import {EmergencyQuery} from './Emergency_query'
const getEmergency = (params) =>{
    return async (dispatch) => {
        const resultParams=await EmergencyQuery(params)
        if (resultParams.status) {
            dispatch({type:"CHANGE_LOADING_TABLE_EMS"})
            const count = await getCountDataEMS(resultParams.content)
            // eslint-disable-next-line no-unused-expressions
            count !== undefined ? dispatch({type:"CHANGE_DATA_SIZE",payload:count}):0
            const data = await getDataEMS(resultParams.content)
            console.log("getDataEMS:",data);
            if (data !== undefined) {

                dispatch({
                    payload:data ,
                    type:"DISPLAY_DATATABLE_EMS"
                });
            } else {
                dispatch({
                    payload:[] ,
                    type:"DISPLAY_DATATABLE_EMS"
                });
            }
            dispatch({type:"CHANGE_LOADING_TABLE_EMS"})
        };
    }

}

export {getEmergency}
