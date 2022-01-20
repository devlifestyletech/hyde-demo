import React, { useState, useEffect } from "react";
import Header from "../../../components/Header";
import { Select, Button, Spin } from "antd";
import "./styles/main.style.css";
import { PlusOutlined } from "@ant-design/icons";
import { db } from "../../../utils/firebaseConfig";
import { collection, where, query, onSnapshot } from "firebase/firestore";
import addressService from "../../../services/address.service";

//components import
import SchedularComponent from "../components/Reservationschedular";
import CreateReservation from "../components/CreateReservation";

const { Option } = Select;

export default function BookingCalendarPage() {
	const [createModalVisible, setCreateModalVisible] = useState(false);
	const [facilities, setFacilities] = useState([]);
	const [reservations, setReservations] = useState([]);
	const [loading, setLoading] = useState(false);
	const [selectedFacilities, setSelectedFacilities] = useState("aPntKgd7dqVmG6qe2mk9");
	const [addresses, setAddresses] = useState();

	let selectedFacility = facilities.find((facility) => facility.id === selectedFacilities);
	let timeSlot = reservations.map(({ start_time, end_time }) => ({ start: start_time, end: end_time }));
	console.log(selectedFacility);

	useEffect(() => {
		const queryFacilities = query(collection(db, "facilities"));
		const queryReservations = query(collection(db, "reservations"), where("facility_id", "==", selectedFacilities));
		setLoading(true);
		addressService.getAllAddresses().then((res) => setAddresses(res.data));
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
	}, [selectedFacilities]);

	console.log(reservations);

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
				{loading ? (
					<div style={{ textAlign: "center", margin: 80 }}>
						<Spin />
						<p>Please wait...</p>
					</div>
				) : (
					<SchedularComponent reservation={reservations} />
				)}
				<CreateReservation
					visible={createModalVisible}
					onCancel={() => setCreateModalVisible(false)}
					facility={selectedFacility}
					time_slot={timeSlot}
					addresses={addresses}
				/>
			</div>
		</>
	);
}
