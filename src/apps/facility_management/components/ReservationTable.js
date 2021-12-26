import React, { useState } from "react";
import { reservations } from "../utils/reservation.data";
import { Table, Button, Divider, Modal } from "antd";
import { format } from "date-fns";
import qrIcon from "../assets/qr.svg";
import editIcon from "../assets/edit.svg";
import delIcon from "../assets/trash-2.svg";
import EditReservation from "./EditReservation";
import QrReservationModal from "./QrReservationModal";

export default function ReservationTable() {
	const [editReservationModalVisibility, setEditReservationModalVisibility] = useState(false);
	const [handleId, setHandleId] = useState();
	const [showQrReservationModalVisible, setShowQrReservationModalVisible] = useState(false);

	function showConfirmDelete(id) {
		Modal.confirm({
			centered: true,
			title: "Are you sure you want to delete reservation?",
			icon: null,
			autoFocusButton: null,
			okText: "Confirm",
			okType: "danger",
			okButtonProps: { shape: "round", type: "danger", size: "large" },
			cancelButtonProps: { shape: "round", size: "large" },
			onOk() {
				console.log("OK");
			},
			onCancel() {
				console.log("Cancel");
			}
		});
	}

	const columns = [
		{
			title: "Topic",
			dataIndex: "topic",
			key: "index"
		},
		{
			title: "Name-Surname",
			dataIndex: "fullname",
			key: "index"
		},
		{
			title: "Room Number",
			dataIndex: "room_number",
			key: "index"
		},
		{
			title: "No. of People",
			dataIndex: "userAmount",
			key: "index"
		},
		{
			title: "Booking Date",
			dataIndex: "startDate",
			key: "index",
			render: (item) => <div>{format(item, "yyyy-MM-dd")}</div>
		},
		{
			title: "Booking Date",
			dataIndex: "startDate",
			key: "index",
			render: (item) => <div>{format(item, "HH:mm")}</div>
		},
		{
			title: "Booking Date",
			dataIndex: "endDate",
			key: "index",
			render: (item) => <div>{format(item, "HH:mm")}</div>
		},
		{
			title: "Action",
			dataIndex: "id",
			key: "index",
			render: (id) => (
				<div>
					<Button
						type='link'
						onClick={() => {
							setHandleId(id);
							setShowQrReservationModalVisible(true);
						}}
						icon={<img src={qrIcon} alt='qrcode' />}
					/>
					<Divider type='vertical' />
					<Button
						type='link'
						onClick={() => {
							setHandleId(id);
							setEditReservationModalVisibility(true);
						}}
						icon={<img src={editIcon} alt='edit' />}
					/>
					<Divider type='vertical' />
					<Button
						type='link'
						onClick={() => {
							showConfirmDelete(id);
						}}
						icon={<img src={delIcon} alt='delete' />}
					/>
				</div>
			)
		}
	];

	return (
		<div>
			<Table dataSource={reservations} columns={columns} />
			<EditReservation visible={editReservationModalVisibility} id={handleId} onCancel={() => setEditReservationModalVisibility(false)} />
			<QrReservationModal visible={showQrReservationModalVisible} id={handleId} onCancel={() => setShowQrReservationModalVisible(false)} />
		</div>
	);
}
