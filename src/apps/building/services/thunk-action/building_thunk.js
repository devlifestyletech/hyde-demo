import {getDataBuilding,getCountBuildList} from '../API/building_API'
import {buildingProgressQuery} from './buildProgress_query'
const DataBuildingStore = (params) => {
    return async (dispatch) => {
        const resultParams=await buildingProgressQuery(params)
        if (resultParams.status) {
            dispatch({type:"LOADING_BUILD"})
            const count = await getCountBuildList(resultParams.content)
            // eslint-disable-next-line no-unused-expressions
            count !== undefined ? dispatch({type:"CHANGE_DATA_SIZE_BUILD",payload:count}):0
            const dataBuilding = await getDataBuilding(resultParams.content);
            //  console.log("DataBuildingStore",dataBuilding)
            dispatch({
                type: "DISPLAY_DATA_BUILDING",
                payload: dataBuilding
            })
            dispatch({type:"LOADING_BUILD"})
        }
    }
}

export {DataBuildingStore}

