import React from "react";
import Header from "../../../components/Header";
import BarGraph from "../components/BarGraph";
import PieGraph from "../components/PieGraph";
import Statistic from "../components/Statistic";
import "./styles/dashboard.css";
import { Row, Button, DatePicker } from "antd";
import { VerticalAlignBottomOutlined } from "@ant-design/icons";
import moment from "moment";
const { RangePicker } = DatePicker;

function Dashboard() {
	const monthFormat = "MMMM ,YYYY";

	const customMonthStartEndFormat = (value) => `All of Month: ${moment(value).startOf("month").format(monthFormat)}`;
	return (
		<>
			<Header title='User management dashboard' />
			<Statistic />
			<Row style={{ justifyContent: "space-between" }}>
				<div className='range' style={{ fontSize: 24, fontWeight: "bold", marginTop: 20 }}>
					Select Month :  <DatePicker picker='month' format={customMonthStartEndFormat} />
				</div>
				<div>
					<Button
						shape='round'
						size='large'
						icon={<VerticalAlignBottomOutlined />}
						style={{ float: "right", backgroundColor: "rgba(216, 170, 129, 1)", color: "rgba(255, 255, 255, 1)" }}>
						Export
					</Button>
				</div>
			</Row>
			<br />
			<div style={{ justifyContent: "center" }}>
				<div className='bar'>
					<div className='title-graph'>Statics of New Co-Owner</div>
					<div className='graph'>
						<BarGraph />
					</div>
				</div>
				<div className='pie'>
					<div className='title-graph'>Status</div>
					<div className='graph'>
						<PieGraph />
					</div>
				</div>
			</div>
		</>
	);
}

export default Dashboard;
