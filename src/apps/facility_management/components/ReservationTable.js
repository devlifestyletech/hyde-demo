import React, { useState } from "react";
import { Table, Button, Divider, Modal, message } from "antd";
import { format } from "date-fns";
import qrIcon from "../assets/qr.svg";
import editIcon from "../assets/edit.svg";
import delIcon from "../assets/trash-2.svg";
import EditReservation from "./EditReservation";
import QrModal from "./QrModal";
import { db } from "../../../utils/firebaseConfig";
import { doc, deleteDoc } from "firebase/firestore";

export default function ReservationTable({ data, facility }) {
	const [editReservationModalVisibility, setEditReservationModalVisibility] = useState(false);
	const [handleItem, setHandleItem] = useState();
	const [showQrModalVisible, setShowQrModalVisible] = useState(false);

	// console.log(handleItem);
	// if (facility) console.log(facility);

	function showConfirmDelete(item) {
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
				return new Promise(async function (resolve, reject) {
					await deleteDoc(doc(db, "reservations", item))
						.then(() => {
							resolve();
							message.success("Delete reservation successfully");
						})
						.catch((err) => {
							console.error(err);
							reject(err);
						});
				});
			},
			onCancel() {
				// console.log("Cancel");
			}
		});
	}

	const columns = [
		{
			title: "Booked",
			dataIndex: "booked",
			key: "index"
		},
		{
			title: "Topic",
			dataIndex: "topic",
			key: "index"
		},
		{
			title: "Name-Surname",
			dataIndex: "name",
			key: "index"
		},
		{
			title: "Room Number",
			dataIndex: "room_number",
			key: "index"
		},
		{
			title: "No. of People",
			dataIndex: "user_amount",
			key: "index"
		},
		{
			title: "Booking Date",
			dataIndex: "startDateTime",
			key: "index",
			render: (item) => <div>{format(item.toDate(), "yyyy-MM-dd")}</div>
		},
		{
			title: "Booking Date",
			dataIndex: "startDateTime",
			key: "index",
			render: (item) => <div>{format(item.toDate(), "HH:mm")}</div>
		},
		{
			title: "Booking Date",
			dataIndex: "endDateTime",
			key: "index",
			render: (item) => <div>{format(item.toDate(), "HH:mm")}</div>
		},
		{
			title: "Action",
			dataIndex: "id",
			key: "index",
			render: (item) => (
				<div>
					<Button
						type="link"
						onClick={() => {
							let dataId = data.find((i) => i.id === item);
							setHandleItem(dataId);
							setShowQrModalVisible(true);
						}}
						icon={<img src={qrIcon} alt="qrcode" />}
					/>
					<Divider type="vertical" />
					<Button
						type="link"
						onClick={(e) => {
							let dataId = data.find((i) => i.id === item);
							setHandleItem(dataId);
							setEditReservationModalVisibility(true);
						}}
						icon={<img src={editIcon} alt="edit" />}
					/>
					<Divider type="vertical" />
					<Button
						type="link"
						onClick={() => {
							showConfirmDelete(item);
						}}
						icon={<img src={delIcon} alt="delete" />}
					/>
				</div>
			)
		}
	];

	return (
		<div>
			<Table dataSource={data} columns={columns} />
			<EditReservation
				visible={editReservationModalVisibility}
				facility={facility}
				data={handleItem}
				onCancel={() => setEditReservationModalVisibility(false)}
			/>
			<QrModal visible={showQrModalVisible} data={handleItem} onCancel={() => setShowQrModalVisible(false)} />
		</div>
	);
}
