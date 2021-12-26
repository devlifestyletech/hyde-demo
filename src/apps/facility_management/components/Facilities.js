import React, { useState } from "react";
import { Space, Card, Row, Col, Button, Divider, Switch } from "antd";
import { facilities } from "../utils/facilities.data";
import "./styles/facilities.css";
import editIcon from "../assets/edit.svg";
import peopleIcon from "../assets/people.svg";
import clockIcon from "../assets/clock.svg";
import EditFacility from "./EditFacility";

export default function Facilities() {
	const [handleId, setHandleId] = useState();
	const [editFacilityModalVisible, setEditfacilityModalVisible] = useState(false);
	return (
		<>
			<Space wrap>
				{facilities ? (
					facilities.map((facility, index) => (
						<div className='facilities-card'>
							<Card key={index} cover={<img src={facility.img} alt={facility.room_name} width='435' height='286' />}>
								<Row>
									<Col span={22}>
										<div className='facility-title'>{facility.room_name}</div>
									</Col>
									<Col span={2}>
										<div className='facility-edit'>
											<Button
												type='link'
												onClick={() => {
													setHandleId(facility.id);
													setEditfacilityModalVisible(true);
												}}>
												<img src={editIcon} alt='edit' />
											</Button>
										</div>
									</Col>
								</Row>
								<div className='facility-detail'>{facility.room_detail}</div>
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
										<div style={{ marginRight: 10, float: "left" }}>
											<Switch checked={facility.locked} />
										</div>
										<div style={{ fontSize: 18, float: "left" }}>{facility.locked ? <>Lock</> : <>Unlock</>}</div>
									</div>
									<div style={{ float: "right", textAlign: "right" }}>
										{facility.users ? (
											<div style={{ fontSize: 18, color: "rgba(245, 27, 27, 1)" }}>Not Available ({facility.users})</div>
										) : (
											<div style={{ fontSize: 18, color: "rgba(118, 175, 46, 1)" }}>Available</div>
										)}
									</div>
								</div>
							</Card>
						</div>
					))
				) : (
					<div></div>
				)}
			</Space>
			<EditFacility visible={editFacilityModalVisible} id={handleId} onCancel={() => setEditfacilityModalVisible(false)} />
		</>
	);
}
