
import {getFixReport,getCountFixReport} from '../../api/fix_report_api'
import {fixReportQuery} from './fix_report_query'
const getDataFixReport = (params) =>{
    return async (dispatch) => {
        const resultParams=await fixReportQuery(params)
        if (resultParams.status) {
            dispatch({type:"CHANGE_LOADING_TABLE_FIX_REPORT"})
            const count = await getCountFixReport(resultParams.content)
            // eslint-disable-next-line no-unused-expressions
            count !== undefined ? dispatch({type:"CHANGE_DATA_SIZE_FIX_REPORT",payload:count}):0
            const data = await getFixReport(resultParams.content)
            console.log("getFixReport:",data);
            if (data !== undefined) {

                dispatch({
                    payload:data ,
                    type:"DISPLAY_DATATABLE_FIX_REPORT"
                });
                dispatch({type:"CHANGE_STATUS_FIX_REPORT",payload:params.status})
            } else {
                dispatch({
                    payload:[] ,
                    type:"DISPLAY_DATATABLE_FIX_REPORT"
                });
            }
            dispatch({type:"CHANGE_LOADING_TABLE_FIX_REPORT"})
        };
    }

}




export {getDataFixReport}
