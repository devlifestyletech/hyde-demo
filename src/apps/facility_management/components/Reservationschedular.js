import React from "react";
import Scheduler from "devextreme-react/scheduler";
import { Row, Col, Modal, Button } from "antd";
import { format } from "date-fns";

import { reservations } from "../utils/reservation.data";
import "./styles/appointment.css";
import trashIcon from "../assets/trash-2.svg";

export default function SchedularComponent() {
	const views = ["day", "week", "month"];

	const Appointment = (model) => {
		const { appointmentData } = model.data;
		return (
			<div className="showtime-preview">
				<div>
					<strong>{appointmentData.topic}</strong>
					<br />
					<br />
				</div>
				<div>
					{format(appointmentData.startDate, "hh:mm aa")}
					{" - "}
					{format(appointmentData.endDate, "hh:mm aa")}
				</div>
				<div>{appointmentData.fullname}</div>
			</div>
		);
	};

	function showDeleteConfirm(id) {
		Modal.confirm({
			center: true,
			title: "Are you sure delete this booking?",
			// icon: <ExclamationCircleOutlined />,
			content: "This booking will remove form database",
			okText: "Confirm",
			okType: "danger",
			cancelText: "Keep it",
			onOk() {
				// BookingServices.deleteBooking(id).then(() => onEvent());
			},
			onCancel() {
				console.log("Cancel");
			}
		});
	}

	const AppointmentTooltip = (model) => {
		const { appointmentData } = model.data;
		return (
			<div className="appointment-tooltip" onClick={() => null}>
				<Row>
					<Col>
						<div style={{ height: 50, width: 50, borderRadius: 25, backgroundColor: "rgba(216, 170, 129, 1)", marginRight: 10 }} />
					</Col>
					<Col>
						<div>
							<strong>Topic: {appointmentData.topic}</strong>
							<br />
							{format(appointmentData.startDate, "hh:mm aa")}
							{" - "}
							{format(appointmentData.endDate, "hh:mm aa")}
							<br />
							Name: {appointmentData.fullname}
							<br />
							Phone: {appointmentData.telephone_number}
							<br />
							Number of People: {appointmentData.userAmount}
							<br />
							Note: {appointmentData.note}
						</div>
					</Col>
					<Col>
						<div>
							<Button
								type="link"
								icon={<img src={trashIcon} alt="Delete" />}
								onClick={() => showDeleteConfirm(appointmentData.id)}
								style={{ marginLeft: 115, float: "right", zIndex: 2000 }}
							/>
						</div>
					</Col>
				</Row>
			</div>
		);
	};

	return (
		<Scheduler
			timeZone="Asia/Bangkok"
			dataSource={reservations}
			views={views}
			showAllDayPanel={false}
			height={1000}
			startDayHour={7}
			appointmentComponent={Appointment}
			appointmentTooltipComponent={AppointmentTooltip}
			allowAdding={false}
			allowDeleting={false}
			allowDragging={false}
			allowResizing={false}
			allowTimeZoneEditing={false}
			editing={false}
			style={{ fontFamily: "SukhumvitSet" }}
		/>
	);
}
