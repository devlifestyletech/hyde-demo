import React, { useState } from "react";
import { Modal, Button, Row, Col, Form, Select, Input, InputNumber, DatePicker, message } from "antd";
import QrReservationModal from "./QrReservationModal";
import "./styles/create_modal.css";
import { areIntervalsOverlapping } from "date-fns";
import moment from "moment";

//firebase firestore components
import { db } from "../../../utils/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";

const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

export default function CreateReservation({ facility, time_slot, addresses, visible, onCancel }) {
	const [resId, setResId] = React.useState();
	const [qrModalVisible, setQrModalVisible] = useState(false);
	const [selectedAddress, setSelectedAddress] = useState(null);
	const [selectedUser, setSelectedUser] = useState(null);

	const [createReservationForm] = Form.useForm();

	if (selectedAddress) {
		var address = addresses.find((address) => address.id === selectedAddress);
	}
	if (selectedUser) {
		var user = address.users.find((user) => user.id === selectedUser);
	}
	console.log(facility);

	const onConfirm = (val) => {
		Modal.confirm({
			title: "Are you sure you want to create booking?",
			okButtonProps: { shape: "round", size: "large", type: "primary" },
			cancelButtonProps: { shape: "round", size: "large" },
			icon: null,
			autoFocusButton: null,
			centered: true,
			onOk() {
				return new Promise((resolve, reject) => {
					if (!time_slot.length) {
						let data = {
							user: user.id,
							facility_id: facility.id,
							facility_cover: facility.cover,
							name: user.firstname + " " + user.lastname,
							facility_name: facility.name,
							startDateTime: val.range[0]._d,
							endDateTime: val.range[1]._d,
							user_amount: val.number_of_people,
							note: val.note ? val.note : "",
							booked: val.booked,
							status: 0
						};
						createReservation(data).then((docRef) => {
							resolve();
							message.success("Create Booking Successfully");
							setResId({ id: docRef.id, tel: user ? user.tel : null, ...data });
							setQrModalVisible(true);
						});
					} else if (!checkTimeSlotAvailable()) {
						createError("!Error unavailable", "Date time you picked is not available");
					}
				});
			},
			onCancel() {}
		});
	};

	const createReservation = async (data) => {
		return await addDoc(collection(db, "reservations"), data);
	};

	function createError(title, content) {
		Modal.error({
			title: title,
			content: content,
			centered: true,
			okButtonProps: { shape: "round", size: "large", type: "primary" },
			onOk() {
				Modal.destroyAll();
			}
		});
	}

	const checkTimeSlotAvailable = (picked) => {
		let available = false;
		if (!time_slot.length) {
			available = true;
		} else {
			for (const val of time_slot) {
				if (val != null || undefined) {
					if (!areIntervalsOverlapping(val, picked)) {
						available = true;
					} else {
						available = false;
						break;
					}
				}
			}
		}
		return available;
	};

	function disabledDate(current) {
		return current && current <= moment().startOf("day");
	}

	return (
		<>
			<Modal
				centered
				width={1000}
				title="Create Reservation"
				visible={visible}
				onCancel={() => onCancel()}
				footer={[
					<Button size="large" shape="round" type="primary" onClick={() => createReservationForm.validateFields().then((val) => onConfirm(val))}>
						Create
					</Button>
				]}>
				<Form layout="vertical" form={createReservationForm}>
					<Row>
						<Col span={12} style={{ padding: 10 }}>
							<div className="md-form">
								<div className="form-group">
									<Form.Item
										label="Booked"
										rules={[
											{
												required: true,
												message: "Please select booked!"
											}
										]}
										name="booked">
										<Select placeholder="Please select booked">
											<Option key={"1"} value="Resident">
												Resident
											</Option>
											<Option key={"2"} value="Juristic">
												Juristic
											</Option>
											<Option key={"3"} value="Other">
												Other
											</Option>
										</Select>
									</Form.Item>
									<Form.Item label="Room Name">
										<div className="input-tel">{facility ? facility.name : "Select facility from top selection"}</div>
									</Form.Item>
									<Form.Item
										label="Number of people"
										name="number_of_people"
										rules={[
											{
												required: true,
												message: "Please input user amount"
											}
										]}>
										<InputNumber min={1} max={facility ? facility.max_users : null} style={{ width: "100%", borderRadius: 20 }} />
									</Form.Item>
									<Form.Item
										label="Room Number"
										rules={[
											{
												required: true,
												message: "Please select room number"
											}
										]}
										name="room_number">
										<Select
											showSearch
											placeholder="Search to Select"
											optionFilterProp="children"
											filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
											filterSort={(optionA, optionB) => optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())}
											onChange={setSelectedAddress}>
											{addresses
												? addresses.map((address, index) => (
														<Option key={index} value={address.id}>
															{address.address_number}
														</Option>
												  ))
												: null}
										</Select>
									</Form.Item>
									<Form.Item
										label="Name-Surname"
										name="user"
										rules={[
											{
												required: true,
												message: "Please select resident!"
											}
										]}>
										<Select
											showSearch
											placeholder="Please select address before select resident"
											optionFilterProp="children"
											filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
											filterSort={(optionA, optionB) => optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())}
											onChange={setSelectedUser}>
											{address ? (
												address.users.map((user, index) => (
													<Option key={index} value={user.id}>
														{user.fullname}
													</Option>
												))
											) : (
												<Option disabled>This address doesn't have any resident</Option>
											)}
										</Select>
									</Form.Item>
								</div>
							</div>
						</Col>
						<Col span={12} style={{ padding: 10 }}>
							<div className="md-form">
								<div className="form-group">
									<Form.Item label="Telephone Number">
										<div className="input-tel">{user ? user.tel : "Please select resident user"}</div>
									</Form.Item>
									<Form.Item
										label="Select the time to schedule"
										name="range"
										rules={[
											{
												required: true,
												message: "Please select time range!"
											}
										]}>
										<RangePicker showTime={{ format: "HH:mm" }} format="YYYY-MM-DD HH:mm" minuteStep={10} disabledDate={disabledDate} />
									</Form.Item>
									<Form.Item label="Note" name="note">
										<TextArea placeholder="" autoSize={{ minRows: 4, maxRows: 6 }} defaultValue="" />
									</Form.Item>
								</div>
							</div>
						</Col>
					</Row>
				</Form>
			</Modal>
			<QrReservationModal
				visible={qrModalVisible}
				onCancel={() => {
					setSelectedAddress(null);
					setSelectedUser(null);
					createReservationForm.resetFields();
					setQrModalVisible(false);
					onCancel();
				}}
				data={resId}
			/>
		</>
	);
}
