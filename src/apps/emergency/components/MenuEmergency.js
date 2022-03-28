import React from "react";
import {
    getEmergency
} from "../services/thunk-action/Emergency_thunk";

import {useDispatch, useSelector} from "react-redux";
import {Menu} from "antd";

export const MenuEmergency = () => {
    const {count, paramsEMS} = useSelector(
        (state) => state.EMSActionRedux
    );
    const dispatch = useDispatch();
    const selectedMenuBillPayment = async ({item}) => {

        MenuEMS.map(async (e, i) => {
            if (e.title === item.props.title) {
                dispatch({type: "CHANGE_COUNT", payload: i});
               
                    switch (i) {
                        // เพิ้ทท xaseตามtype
                        case 0:
                            paramsEMS.status =undefined
                            paramsEMS.defaultPage = 1
                            break;
                        case 1:
                            paramsEMS.status = "Hospital"
                            paramsEMS.defaultPage = 1
                            break;
                        case 2:
                            paramsEMS.status = "Ambulance"
                            paramsEMS.defaultPage = 1
                            break;
                        case 3:
                            paramsEMS.status = "Fire Truck"
                            paramsEMS.defaultPage = 1
                          
                            break;
                        case 4:
                            paramsEMS.status = "Rescue"
                            paramsEMS.defaultPage = 1
                           
                            break;
                        case 5:
                            paramsEMS.status = "Police"
                            paramsEMS.defaultPage = 1
                         
                            break;

                        default:
                            paramsEMS.status =undefined
                            paramsEMS.defaultPage = 1
                            break;
                    }
              
              
                dispatch(getEmergency(paramsEMS));
            }
        });
        // if (item.props.title === "Bill not generated") {
        //     paramsBilling.status = undefined;
        //     dispatch(getCustomerList(paramsBilling));
        // } else {

        //     paramsBilling.status = item.props.title;
        //     dispatch(getBillingPayment(paramsBilling));

        // }
    };
    const MenuEMS = [
        {title: "All Contact", titleText: "All Contact"},
        {title: "Hospital", titleText: "Hospital"},
        {title: "Ambulance", titleText: "Ambulance"},
        {title: "Fire Truck", titleText: "Fire Truck"},
        {title: "Rescue", titleText: "Rescue"},
        {title: "Police station", titleText: "Police station"},
    ];

    return (
        <div style={{paddingBottom: "5vh"}}>
            <Menu
                mode="horizontal"
                onClick={selectedMenuBillPayment}
                selectedKeys={[`${count}`]}
            >
                {MenuEMS.map((e, i) => {
                    return (
                        <Menu.Item key={i} title={e.title}>
                            <text style={{fontWeight: "bold", fontSize: "1rem"}}>
                                {e.title || e.titleText}
                            </text>
                        </Menu.Item>
                    );
                })}
            </Menu>
        </div>
    );
};


