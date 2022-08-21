import React from "react";
import {
  getBillingPayment,
  getCustomerList,
} from "../services/thunk-action/payment_thunk";
import { useDispatch, useSelector } from "react-redux";
import { Menu } from "antd";
export const MenuBillPayment = () => {
  const { count, paramsBilling } = useSelector(
    (state) => state.PaymentActionRedux
  );
  const dispatch = useDispatch();
  const selectedMenuBillPayment = async ({ item }) => {

    MenuPayment.map(async (e, i) => {
      if (e.title === item.props.title) {
        dispatch({ type: "CHANGE_COUNT", payload: i });
      }
    });
    if (item.props.title === "Bill not generated") {
      paramsBilling.status = undefined;
      paramsBilling.defaultPage = 1
      dispatch({type:"CHANGE_PAGE_DEFAULT",payload:1})
      // paramsBilling.pagesize = 5
      dispatch(getCustomerList(paramsBilling));
    } else {
      paramsBilling.defaultPage = 1
      dispatch({type:"CHANGE_PAGE_DEFAULT",payload:1})
        paramsBilling.status = item.props.title;
        dispatch(getBillingPayment(paramsBilling));

    }
  };
  const MenuPayment = [
    { title: "Bill not generated", titleText: "Bill not generated" },
    { title: "Wait for payment", titleText: "Wait for payment" },
    { title: "Pending review", titleText: "Pending review" },
    { title: "Payment successful", titleText: "Payment successful" },
    { title: "Payment annotation", titleText: "Payment annotation" },
    { title: "Out Date", titleText: "Out Date" },
    
  ];

  return (
    <div style={{ paddingBottom: "5vh" }}>
      <Menu
        mode="horizontal"
        onClick={selectedMenuBillPayment}
        selectedKeys={[`${count}`]}
      >
        {MenuPayment.map((e, i) => {
          return (
            <Menu.Item key={i} title={e.title}>
              <text style={{ fontWeight: "bold", fontSize: "1rem" }}>
                {e.title || e.titleText}
              </text>
            </Menu.Item>
          );
        })}
      </Menu>
    </div>
  );
};
