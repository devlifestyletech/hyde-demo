import React from "react";
import Header from "../../../components/Header";
import { Select, Input } from "antd";
import ReservationTable from "../components/ReservationTable";



const { Option } = Select;

export default function BookingListsPage() {
	return (
		<>
			<Header title='Booking Lists' />
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
				<Input placeholder='Search by name or room number' style={{ width: 400, borderRadius: 20, height: 40, marginLeft: 10 }} />
			</div>
			<div className='content-container'>
				<ReservationTable />
			</div>
		</>
	);
}
