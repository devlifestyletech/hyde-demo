import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Menu,Badge } from "antd";
import { getDataFixReport } from '../service/thunk-action/fix_report_thunk'
export const MenuFixingReport= () => {
  const { count, paramsFixReport,countFCM } = useSelector(
    (state) => state.FixReportActionRedux
  );

  const dispatch = useDispatch();
  const selectedMenuBillPayment = async ({ item }) => {

    MenuPayment.map(async (e, i) => {
      if (e.title === item.props.title) {
        dispatch({ type: "CHANGE_COUNT_FIX_REPORT", payload: i });
      }
    });
    if (item.props.title === "All") {
      paramsFixReport.status = undefined;
      paramsFixReport.defaultPage = 1
      dispatch({type:"CHANGE_PAGE_DEFAULT_FIX_REPORT",payload:1})
      // paramsFixReport.pagesize = 5
      dispatch(getDataFixReport(paramsFixReport));
    } else {
      paramsFixReport.defaultPage = 1
      dispatch({type:"CHANGE_PAGE_DEFAULT_FIX_REPORT",payload:1})
        paramsFixReport.status = item.props.title;
        dispatch(getDataFixReport(paramsFixReport));

    }
  };
  const MenuPayment = [
    { title: "All", titleText: "All" },
    { title: "Pending", titleText: "Pending" },
    { title: "Repairing", titleText: "Repairing" },
    { title: "Success", titleText: "Success" },
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
                {e.title === "Pending review" &&countFCM !==0 ? <Badge count={countFCM}><div style={{paddingLeft:15 ,paddingBottom:5}}></div></Badge>:null}
               
              </text>
            </Menu.Item>
          );
        })}
      </Menu>
    </div>
  );
};
