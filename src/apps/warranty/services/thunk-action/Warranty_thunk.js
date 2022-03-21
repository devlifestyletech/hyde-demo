
import {getWarranty,getCountWarrantyList} from '../../API/warranty_API'
import {WarrantyQuery} from './Warranty_query'
const getWarrantyProjectStore = (params) =>{
    return async (dispatch) => {
        const resultParams=await WarrantyQuery(params)
        if (resultParams.status) {
            dispatch({type:"CHANGE_LOADING_TABLE_WARRANTY"})
            const count = await getCountWarrantyList(resultParams.content)
            // eslint-disable-next-line no-unused-expressions
            count !== undefined ? dispatch({type:"CHANGE_DATA_SIZE_WARRANTY",payload:count}):0
            const data = await getWarranty(resultParams.content)
            if (data !== undefined) {

                dispatch({
                    payload:data ,
                    type:"DISPLAY_DATATABLE_WARRANTY"
                });
            } else {
                dispatch({
                    payload:[] ,
                    type:"DISPLAY_DATATABLE_WARRANTY"
                });
            }
            dispatch({type:"CHANGE_LOADING_TABLE_WARRANTY"})
        };
    }

}

export {getWarrantyProjectStore}
