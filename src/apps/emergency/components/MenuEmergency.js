import React from "react";
import {
    getBillingPayment,
    getCustomerList,
} from "../../payment/services/thunk-action/payment_thunk";
import {getDataEMS} from "../services/API/EmergencyAPI";
import {useDispatch, useSelector} from "react-redux";
import {Menu} from "antd";

export const MenuEmergency = () => {
    const {count, paramsBilling} = useSelector(
        (state) => state.EMSActionRedux
    );
    const dispatch = useDispatch();
    const selectedMenuBillPayment = async ({item}) => {

        MenuPayment.map(async (e, i) => {
            if (e.title === item.props.title) {
                dispatch({type: "CHANGE_COUNT", payload: i});
                const data = await getDataEMS()
                const result = data.filter((e) => {
                    switch (i) {
                        // เพิ้ทท xaseตามtype
                        case 0:
                            return e
                            break;
                        case 1:
                            return e.Type === "Hospital"
                            break;
                        case 2:
                            return e.Type === "Ambulance"
                            break;
                        case 3:
                            return e.Type === "Fire Truck"
                            break;
                        case 4:
                            return e.Type === "Rescue"
                            break;
                        case 5:
                            return e.Type === "Police"
                            break;

                        default:
                            return e
                            break;
                    }
                })
                dispatch({type: "DISPLAY_DATATABLE_EMS", payload: result});
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
    const MenuPayment = [
        {title: "All Contact", titleText: null},
        {title: "Hospital", titleText: null},
        {title: "Ambulance", titleText: null},
        {title: "Fire Truck", titleText: null},
        {title: "Rescue", titleText: null},
        {title: "Police station", titleText: null},
    ];

    return (
        <div style={{paddingBottom: "5vh"}}>
            <Menu
                mode="horizontal"
                onClick={selectedMenuBillPayment}
                selectedKeys={[`${count}`]}
            >
                {MenuPayment.map((e, i) => {
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


