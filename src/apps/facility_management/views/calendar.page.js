import React, { useState } from "react";
import Header from "../../../components/Header";
import { Select, Button } from "antd";
import "./styles/main.style.css";
import { PlusOutlined } from "@ant-design/icons";

//components import
import SchedularComponent from "../components/Reservationschedular";
import CreateReservation from "../components/CreateReservation";

const { Option } = Select;

export default function BookingCalendarPage() {
	const [createModalVisible, setCreateModalVisible] = useState(false);
	return (
		<>
			<Header title='Booking Calendar' />
			<div className='top-container'>
				<Select style={{ width: 400, float: "left" }} size='large' defaultValue='0'>
					<Option value='0'>Room Name : Private Chef Table</Option>
					<Option value='1'>Room Name : Spa, Manicure & Pedicure</Option>
					<Option value='2'>Room Name : Co-Working Space</Option>
					<Option value='3'>Room Name : Library</Option>
					<Option value='4'>Room Name : Theater Room</Option>
					<Option value='5'>Room Name : Glass House</Option>
					<Option value='6'>Room Name : Experiential Golf Simulator</Option>
				</Select>
				<Button
					icon={<PlusOutlined />}
					type='primary'
					size='large'
					shape='round'
					style={{ float: "right" }}
					onClick={() => setCreateModalVisible(true)}>
					Create Reservation
				</Button>
			</div>
			<div className='content-container'>
				<SchedularComponent />
				<CreateReservation visible={createModalVisible} onCancel={() => setCreateModalVisible(false)} />
			</div>
		</>
	);
}
