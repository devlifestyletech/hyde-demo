import React from "react";
import Scheduler from "devextreme-react/scheduler";
import { Row, Col, Modal, Button } from "antd";
import { format } from "date-fns";

import "./styles/appointment.css";
import trashIcon from "../assets/trash-2.svg";

export default function SchedularComponent({ reserves }) {
	const views = ["day", "week", "month"];
	let data = reserves.map(({ name, startDateTime, endDateTime }) => ({
		startDate: startDateTime.toDate(),
		endDate: endDateTime.toDate(),
		name: name
	}));
	console.log(reserves);

	const Appointment = (model) => {
		const { appointmentData } = model.data;
		return (
			<div className="showtime-preview">
				<div>
					{format(appointmentData.startDate, "hh:mm aa")}
					{" - "}
					{format(appointmentData.endDate, "hh:mm aa")}
				</div>
				<div>
					<strong>{appointmentData.name}</strong>
				</div>
			</div>
		);
	};

	return (
		<Scheduler
			timeZone="Asia/Bangkok"
			dataSource={data}
			views={views}
			showAllDayPanel={false}
			height={1000}
			appointmentComponent={Appointment}
			onAppointmentClick={(e) => (e.cancel = true)}
			onAppointmentDblClick={(e) => (e.cancel = true)}
			editing={false}
			style={{ fontFamily: "SukhumvitSet" }}
		/>
	);
}
