import React from 'react'
import Scheduler from 'devextreme-react/scheduler'
import { format } from 'date-fns'

import './styles/appointment.css'

export default function SchedularComponent({ reserves }) {
	const views = ['day', 'week', 'month']
	let data = reserves.map(({ topic, tel, room_number, name, startDateTime, endDateTime }) => ({
		startDate: startDateTime.toDate(),
		endDate: endDateTime.toDate(),
		name: name,
		topic: topic,
		tel: tel,
		room_number: room_number,
	}))

	const Appointment = (model) => {
		const { appointmentData } = model.data
		return (
			<div className='showtime-preview'>
				<div>
					<strong style={{ fontFamily: 'SukhumvitSet', fontSize: 16 }}>{appointmentData.topic}</strong>
				</div>
				<br />
				<div style={{ fontFamily: 'SukhumvitSet', fontSize: 16 }}>
					{format(appointmentData.startDate, 'hh:mm aa')}
					{' - '}
					{format(appointmentData.endDate, 'hh:mm aa')}
				</div>
				<div>
					<p style={{ fontFamily: 'SukhumvitSet', fontSize: 16 }}>Name : {appointmentData.name}</p>
				</div>
			</div>
		)
	}

	return (
		<Scheduler
			timeZone='Asia/Bangkok'
			dataSource={data}
			views={views}
			showAllDayPanel={false}
			height={1000}
			editing={false}
			appointmentComponent={Appointment}
			onAppointmentClick={(e) => (e.cancel = true)}
			onAppointmentDblClick={(e) => (e.cancel = true)}
			style={{ fontFamily: 'SukhumvitSet' }}
		/>
	)
}
