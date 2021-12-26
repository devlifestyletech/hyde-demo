import React from "react";
import QRCode from "qrcode.react";
import { Modal, Row, Col, Button } from "antd";
import { format } from "date-fns";

// imageSettings={{ src: qrlogo, height: 50, width: 50 }}

export default function QrReservationModal({ id, visible, onCancel }) {
	return (
		<>
			<Modal centered title='Reservation' visible={visible} onCancel={() => onCancel()} footer={null} width={400}>
				<div style={{ textAlign: "center" }}>
					<QRCode value={id} size={200} />
				</div>
				<div style={{ paddingLeft: 30, marginTop: 20 }}>
					<Row>
						<Col span={12}>RoomName :</Col>
						<Col span={12}>Co-working Space</Col>
					</Row>
					<Row>
						<Col span={12}>Time :</Col>
						<Col span={12}>08:00 - 10:00</Col>
					</Row>
					<Row>
						<Col span={12}>Topic :</Col>
						<Col span={12}>Meeting Developer</Col>
					</Row>
					<Row>
						<Col span={12}>Name - Surname :</Col>
						<Col span={12}>Jenna Kim</Col>
					</Row>
					<Row>
						<Col span={12}>Telephone Number :</Col>
						<Col span={12}>0894684587</Col>
					</Row>
					<Row>
						<Col span={12}>Number of People :</Col>
						<Col span={12}>5</Col>
					</Row>
					<Row>
						<Col span={12}>Note :</Col>
						<Col span={12}>Meeting Team</Col>
					</Row>
				</div>
				<div style={{ textAlign: "center" }}>
					<Button shape='round' size='large' onClick={null} style={{ width: 200, marginTop: 50 }}>
						Share
					</Button>
				</div>
			</Modal>
		</>
	);
}
