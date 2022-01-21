import React, { useState, useEffect } from "react";
import { Space, Card, Row, Col, Button, Divider, Switch } from "antd";
// firebase
import { db } from "../../../utils/firebaseConfig";
import { collection, query, onSnapshot } from "firebase/firestore";

// css and components
import "./styles/facilities.css";
import editIcon from "../assets/edit.svg";
import peopleIcon from "../assets/people.svg";
import clockIcon from "../assets/clock.svg";
import EditFacility from "./EditFacility";
import Loading from "./Loading";

// constraint
const q = query(collection(db, "facilities"));

export default function Facilities() {
	const [facilities, setFacilities] = useState();
	const [handleId, setHandleId] = useState();
	const [editFacilityModalVisible, setEditfacilityModalVisible] = useState(false);

	useEffect(() => {
		onSnapshot(q, (QuerySnapshot) => {
			let facility = [];
			QuerySnapshot.forEach((doc) => {
				let data = { id: doc.id, ...doc.data() };
				facility.push(data);
			});
			setFacilities(facility);
		});
	}, []);

	if (handleId) {
		var newValues = facilities.find((facility) => facility.id === handleId);
		// console.log(newValues);
	}

	// console.log(facilities);

	return (
		<>
			<Space wrap>
				{facilities ? (
					facilities.map((facility, index) => (
						<div className="facilities-card" key={index}>
							<Card cover={<img src={facility.cover} alt={facility.name} className="facility-cover" />}>
								<Row>
									<Col span={22}>
										<div className="facility-title">{facility.name}</div>
									</Col>
									<Col span={2}>
										<div className="facility-edit">
											<Button
												type="link"
												onClick={() => {
													setHandleId(facility.id);
													setEditfacilityModalVisible(true);
												}}>
												<img src={editIcon} alt="edit" />
											</Button>
										</div>
									</Col>
								</Row>
								<div className="facility-detail">{facility.room_detail}</div>
								<div className="facility-limit">
									<Row>
										<Col span={8}>
											<Row>
												<div style={{ marginRight: 5 }}>
													<img src={peopleIcon} alt="people" />
												</div>
												{facility.max_users} <div style={{ marginLeft: 5 }}>Persons</div>
											</Row>
										</Col>
										<Col span={16}>
											<Row>
												<div style={{ marginRight: 5 }}>
													<img src={clockIcon} alt="clock" />
												</div>
												{facility.max_hours} <div style={{ marginLeft: 5 }}>Hours (Maximum Hours)</div>
											</Row>
										</Col>
									</Row>
								</div>
								<Divider size="large" />
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
					<div className="load">
						<Loading />
					</div>
				)}
			</Space>
			<EditFacility visible={editFacilityModalVisible} id={handleId} value={newValues} onCancel={() => setEditfacilityModalVisible(false)} />
		</>
	);
}
