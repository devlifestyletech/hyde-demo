import React, { useState, useEffect } from 'react'
import Header from '../../../components/Header'
import { Select, Input, Spin } from 'antd'
import ReservationTable from '../components/ReservationTable'

import { db } from '../../../utils/firebaseConfig'
import { collection, query, where, onSnapshot } from 'firebase/firestore'

// constraint
const { Option } = Select

export default function BookingListsPage() {
	const [facilities, setFacilities] = useState([])
	const [reservations, setReservations] = useState([])
	const [loading, setLoading] = useState(false)
	const [selectedFacilities, setSelectedFacilities] = useState('VZbh7t4r9GlBIShhRFHe')
	const [search, setSearch] = useState('')

	useEffect(() => {
		const queryFacilities = query(collection(db, 'facilities'))
		const queryReservations = query(collection(db, 'reservations'), where('facility_id', '==', selectedFacilities))

		setLoading(true)
		onSnapshot(queryFacilities, (QuerySnapshot) => {
			let facility = []
			QuerySnapshot.forEach((doc) => {
				let data = { id: doc.id, ...doc.data() }
				facility.push(data)
			})
			setFacilities(facility)
		})
		onSnapshot(queryReservations, (QuerySnapshot) => {
			let reservation = []
			QuerySnapshot.forEach((doc) => {
				let data = { id: doc.id, ...doc.data() }
				reservation.push(data)
			})
			setReservations(reservation)
			setLoading(false)
		})
	}, [selectedFacilities])

	return (
		<>
			<Header title='Booking Lists' />
			<div className='top-container'>
				<Select style={{ width: 400, float: 'left' }} size='large' defaultValue={selectedFacilities} onChange={setSelectedFacilities}>
					{!facilities.length
						? null
						: facilities.map((facility, index) => (
								<Option key={index} value={facility.id}>
									Room Name : {facility.name}
								</Option>
						  ))}
				</Select>
				<Input placeholder='Search by name or room number' style={{ width: 400, borderRadius: 20, height: 40, marginLeft: 10 }} value={search} onChange={(e) => setSearch(e.target.value)} />
			</div>
			<div className='content-container'>
				{loading ? (
					<div style={{ width: '100%', justifyContent: 'center', alignContent: 'center' }}>
						<Spin />
					</div>
				) : (
					<ReservationTable data={reservations} facility={facilities} />
				)}
			</div>
		</>
	)
}
