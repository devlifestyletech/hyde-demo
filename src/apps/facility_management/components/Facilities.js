import React, { useState, useEffect } from 'react'
import { Space, Card, Row, Col, Modal, Button, Divider, Switch } from 'antd'
// firebase
import { db } from '../../../utils/firebaseConfig'
import { collection, query, onSnapshot, doc, updateDoc } from 'firebase/firestore'
import { LockOutlined, UnlockOutlined } from '@ant-design/icons'

// css and components
import './styles/facilities.css'
import editIcon from '../assets/edit.svg'
import peopleIcon from '../assets/people.svg'
import clockIcon from '../assets/clock.svg'
import EditFacility from './EditFacility'
import Loading from './Loading'

// constraint
const q = query(collection(db, 'facilities'))

export default function Facilities() {
	const [facilities, setFacilities] = useState()
	const [handleId, setHandleId] = useState()
	const [editFacilityModalVisible, setEditfacilityModalVisible] = useState(false)

	useEffect(() => {
		onSnapshot(q, (QuerySnapshot) => {
			let facility = []
			QuerySnapshot.forEach((doc) => {
				let data = { id: doc.id, ...doc.data() }
				facility.push(data)
			})
			setFacilities(facility)
		})
	}, [])

	if (handleId) {
		var newValues = facilities.find((facility) => facility.id === handleId)
		console.log(newValues)
	}

	// console.log(facilities);
	const changeLockedState = (id, lockState) => {
		const documentRef = doc(db, 'facilities', id)
		Modal.confirm({
			title: lockState ? 'Are you sure you want to unlock this facility ?' : 'Are you sure you want to lock this facility ?',
			okButtonProps: { shape: 'round', size: 'large', type: 'primary' },
			cancelButtonProps: { shape: 'round', size: 'large' },
			icon: null,
			autoFocusButton: null,
			centered: true,
			onOk() {
				return new Promise((resolve, reject) => {
					updateDoc(documentRef, { locked: !lockState })
						.then(() => {
							resolve('Success')
						})
						.catch((error) => {
							console.error(error)
							reject('Error')
						})
				})
			}
		})
	}

	return (
		<>
			<Space wrap>
				{facilities ? (
					facilities.map((facility, index) => (
						<div className='facilities-card' key={index}>
							<Card cover={<img src={facility.cover} alt={facility.name} className='facility-cover' />}>
								<Row>
									<Col span={22}>
										<div className='facility-title'>{facility.name}</div>
									</Col>
									<Col span={2}>
										<div className='facility-edit'>
											<Button
												type='link'
												onClick={() => {
													setHandleId(facility.id)
													setEditfacilityModalVisible(true)
												}}>
												<img src={editIcon} alt='edit' />
											</Button>
										</div>
									</Col>
								</Row>
								<div className='facility-detail'>{facility.detail}</div>
								<div className='facility-limit'>
									<Row>
										<Col span={8}>
											<Row>
												<div style={{ marginRight: 5 }}>
													<img src={peopleIcon} alt='people' />
												</div>
												{facility.max_users} <div style={{ marginLeft: 5 }}>Persons</div>
											</Row>
										</Col>
										<Col span={16}>
											<Row>
												<div style={{ marginRight: 5 }}>
													<img src={clockIcon} alt='clock' />
												</div>
												{facility.max_hours} <div style={{ marginLeft: 5 }}>Hours (Maximum Hours)</div>
											</Row>
										</Col>
									</Row>
								</div>
								<Divider size='large' />
								<div>
									<div>
										<div style={{ marginRight: 10, float: 'left' }}>
											<Switch checked={facility.locked} onClick={() => changeLockedState(facility.id, facility.locked)} checkedChildren={<LockOutlined />} unCheckedChildren={<UnlockOutlined />} />
										</div>
										<div style={{ fontSize: 18, float: 'left' }}>{facility.locked ? <>Lock</> : <>Unlock</>}</div>
									</div>
									<div style={{ float: 'right', textAlign: 'right' }}>
										{facility.locked ? <div style={{ fontSize: 18, color: 'rgba(245, 27, 27, 1)' }}>Not Available</div> : <div style={{ fontSize: 18, color: 'rgba(118, 175, 46, 1)' }}>Available</div>}
									</div>
								</div>
							</Card>
						</div>
					))
				) : (
					<div className='load'>
						<Loading />
					</div>
				)}
			</Space>
			<EditFacility visible={editFacilityModalVisible} id={handleId} value={newValues} onCancel={() => setEditfacilityModalVisible(false)} />
		</>
	)
}
