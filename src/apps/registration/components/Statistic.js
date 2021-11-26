import React from "react";
import { Row } from "antd";
import "./styles/Statistic.css";
export default function Statistic() {
	return (
		<Row style={{ justifyContent: "center" }}>
			<div className='owner-main'>
				<div className='number'>1,500</div>
				<div className='tag tag-1'>Co-Owner Total</div>
			</div>
			<div className='owner-main'>
				<div className='number'>30</div>
				<div className='tag tag-2'>New Co-Owner</div>
			</div>
			<div className='owner-main'>
				<div className='number'>1,470</div>
				<div className='tag tag-3'>Co-Owner</div>
			</div>
		</Row>
	);
}
