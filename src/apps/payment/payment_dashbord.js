import React from "react";
import Header from "../../components/Header";
import "./components/chart/styles/dashboard.css";
import { Button, Row } from "antd";
import { VerticalAlignBottomOutlined } from "@ant-design/icons";
import PieChart from "./components/chart/PieChart";
import GraphReserves from "./components/chart/GraphReserves";
const payment_dashbord = () => {
    return (
        <>
            <Header title='Reservation Dashboard' />
            <div className='top-container'>
                <Button icon={<VerticalAlignBottomOutlined />} disabled={true} type='primary' size='large' shape='round' style={{ float: "right" }}>
                    Export
                </Button>
            </div>
            <div className='content-container'>
                <Row>
                    <div className='pie-graph'>
                        <div className='chart-title'>
                            <p style={{ fontSize: 18, paddingLeft: 10 }}>status payment Today</p>
                        </div>
                        <div className='chart-content'>
                            <PieChart />
                        </div>
                    </div>
                    <div className='bar-graph'>
						<div className='chart-title'>
							<p style={{ fontSize: 18, paddingLeft: 10 }}>status payment Today</p>
						</div>
						<div className='chart-content'>
							<GraphReserves />
						</div>
					</div>
                </Row>
                <div className='area-graph'>
                  
                </div>
            </div>
        </>
    )
}
export default payment_dashbord;