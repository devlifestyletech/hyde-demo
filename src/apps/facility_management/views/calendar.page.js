import React, { useState, useEffect } from "react";
import Header from "../../../components/Header";
import { Select, Button } from "antd";
import "./styles/main.style.css";
import { PlusOutlined } from "@ant-design/icons";
import { db } from "../../../utils/firebaseConfig";
import { collection, query, onSnapshot } from "firebase/firestore";

//components import
import SchedularComponent from "../components/Reservationschedular";
import CreateReservation from "../components/CreateReservation";

const { Option } = Select;
// constraint
const queryFacilities = query(collection(db, "facilities"));
const queryReservations = query(collection(db, "reservations"));

export default function BookingCalendarPage() {
	const [createModalVisible, setCreateModalVisible] = useState(false);
	const [facilities, setFacilities] = useState([]);
	const [reservations, setReservations] = useState([]);
	const [loading, setLoading] = useState(false);
	const [selectedFacilities, setSelectedFacilities] = useState("47CYn2H2J0csqBMSWU5Q");

	useEffect(() => {
		setLoading(true);
		onSnapshot(queryFacilities, (QuerySnapshot) => {
			let facility = [];
			QuerySnapshot.forEach((doc) => {
				let data = { id: doc.id, ...doc.data() };
				facility.push(data);
			});
			setFacilities(facility);
			setLoading(false);
		});
		onSnapshot(queryReservations, (QuerySnapshot) => {
			let reservation = [];
			QuerySnapshot.forEach((doc) => {
				let data = { id: doc.id, ...doc.data() };
				reservation.push(data);
			});
			setReservations(reservation);
			setLoading(false);
		});
	}, []);

	return (
		<>
			<Header title="Booking Calendar" />
			<div className="top-container">
				<Select style={{ width: 400, float: "left" }} size="large" defaultValue={selectedFacilities} onChange={setSelectedFacilities}>
					{!facilities.length
						? null
						: facilities.map((facility, index) => (
								<Option key={index} value={facility.id}>
									Room Name : {facility.name}
								</Option>
						  ))}
				</Select>
				<Button
					icon={<PlusOutlined />}
					type="primary"
					size="large"
					shape="round"
					style={{ float: "right" }}
					onClick={() => setCreateModalVisible(true)}>
					Create Reservation
				</Button>
			</div>
			<div className="content-container">
				<SchedularComponent />
				<CreateReservation visible={createModalVisible} onCancel={() => setCreateModalVisible(false)} />
			</div>
		</>
	);
}
