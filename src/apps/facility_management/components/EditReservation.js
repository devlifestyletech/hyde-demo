import React, { useState, useEffect } from "react";
import { Modal, message, Spin, Button, Row, Col, Form, Select, Input, InputNumber, DatePicker } from "antd";
import moment from "moment";
import { areIntervalsOverlapping, differenceInMinutes, hoursToMinutes } from "date-fns";
import { db } from "../../../utils/firebaseConfig";
import { doc, updateDoc, collection, query, onSnapshot } from "firebase/firestore";

const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

export default function EditReservation({ data, facility, visible, onCancel }) {
	const [reservations, setReservations] = useState([]);
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		const queryReservations = query(collection(db, "reservations"));
		onSnapshot(queryReservations, (QuerySnapshot) => {
			let reservation = [];
			QuerySnapshot.forEach((doc) => {
				let reserve = { id: doc.id, ...doc.data() };
				if (reserve.id !== data?.id) {
					reservation.push(data);
				}
			});
			setReservations(reservation);
			setLoading(false);
		});
	}, [data]);

	var time_slot = reservations?.map((item) => ({ start: item?.startDateTime.toDate(), end: item?.endDateTime.toDate() }));
	let f = facility.find((i) => i.id === data?.facility_id);
	const [editReservationForm] = Form.useForm();
	if (data) console.log(data);
	if (facility) console.log(facility);

	if (data) {
		editReservationForm.setFieldsValue({
			topic: data.topic,
			number_of_people: data.user_amount,
			note: data.note,
			booked: data.booked
		});
	}

	const onConfirm = (val) => {
		Modal.confirm({
			centered: true,
			title: "Are you sure you want to edit booking?",
			okButtonProps: { shape: "round", size: "large", type: "primary" },
			cancelButtonProps: { shape: "round", size: "large" },
			icon: null,
			autoFocusButton: null,
			onOk() {
				let newData = {
					topic: val.topic,
					startDateTime: val.range[0]._d,
					endDateTime: val.range[1]._d,
					user_amount: val.number_of_people,
					note: val.note ? val.note : "",
					booked: val.booked
				};
				console.log(newData);
				var timeSlot = { start: new Date(val.range[0]), end: new Date(val.range[1]) };
				let daily_startTime = new Date(val.range[0]).setHours(f?.daily_start, 0, 0, 0);
				let daily_stopTime = new Date(val.range[0]).setHours(f?.daily_stop, 0, 0, 0);
				console.log(daily_startTime);
				console.log(daily_stopTime);

				return new Promise((resolve, reject) => {
					if (differenceInMinutes(new Date(val.range[1]), new Date(val.range[0])) > hoursToMinutes(f?.max_hours)) {
						createError("Error Time schedule", "Time schedule you picked is over max hours limit");
					} else if (time_slot.length > 0) {
						let available = false;
						for (const interval of time_slot) {
							if (!areIntervalsOverlapping(interval, timeSlot)) {
								available = true;
							} else {
								available = false;
								break;
							}
						}
						if (available) {
							editReservation(newData)
								.then(() => {
									resolve();
									message.success("Save change successfully");
								})
								.catch((err) => reject(err));
						} else {
							createError("Error unavailable", "Time schedule you picked is not available");
						}
					} else if (differenceInMinutes(new Date(val.range[0]), new Date(daily_startTime)) < 0) {
						createError("Error daily start time", "Start time you picked is not available");
					} else if (differenceInMinutes(new Date(daily_stopTime), new Date(val.range[1])) < 0) {
						createError("Error daily stop time", "End time you picked is not available");
					} else {
						editReservation(newData)
							.then(() => {
								resolve();
								message.success("Save change successfully");
								onCancel();
							})
							.catch((err) => reject(err));
					}
				});
			},
			onCancel() {
				console.log("Cancel");
			}
		});
	};

	const editReservation = async (val) => {
		const docRef = doc(db, "reservations", data.id);
		return await updateDoc(docRef, val);
	};

	function disabledDate(current) {
		return current && current <= moment().startOf("day");
	}

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

	return (
		<>
			<Modal
				centered
				width={1000}
				title="Edit Reservation"
				visible={visible}
				onCancel={() => onCancel()}
				footer={[
					<Button size="large" shape="round" type="primary" onClick={() => editReservationForm.validateFields().then((val) => onConfirm(val))}>
						Save
					</Button>
				]}>
				{loading ? (
					<div style={{ justifyContent: "center", alignContent: "center" }}>
						<Spin />
						<p>Loading...</p>
					</div>
				) : (
					<Form form={editReservationForm} layout="vertical">
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
											<Select placeholder="Please select booked" defaultValue={data?.booked}>
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
											<div className="input-tel">{data?.facility_name}</div>
										</Form.Item>
										<Form.Item
											label="Topic"
											rules={[
												{
													required: true,
													message: "Please select booked!"
												}
											]}
											name="topic">
											<Input defaultValue={data?.topic} />
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
											<InputNumber
												min={1}
												max={f ? f.max_users : null}
												style={{ width: "100%", borderRadius: 20 }}
												defaultValue={data?.user_amount}
											/>
										</Form.Item>
										<Form.Item label="Room Name">
											<div className="input-tel">{data?.room_number}</div>
										</Form.Item>
										<Form.Item label="Name-Surname">
											<div className="input-tel">{data?.name}</div>
										</Form.Item>
									</div>
								</div>
							</Col>
							<Col span={12} style={{ padding: 10 }}>
								<div className="md-form">
									<div className="form-group">
										<Form.Item label="Telephone Number">
											<div className="input-tel">{data?.tel}</div>
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
										<Form.Item label="Note">
											<TextArea placeholder="" autoSize={{ minRows: 3, maxRows: 6 }} defaultValue={data?.note} />
										</Form.Item>
									</div>
								</div>
							</Col>
						</Row>
					</Form>
				)}
			</Modal>
		</>
	);
}
