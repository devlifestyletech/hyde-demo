import React from "react";
import QRCode from "qrcode.react";
import { Modal, Row, Col, Button } from "antd";
import { format } from "date-fns";
import qrlogo from "../assets/hyde_2.svg";

export default function QrReservationModal({ data, visible, onCancel }) {
	return (
		<>
			<Modal centered title="Reservation" visible={visible} onCancel={() => onCancel()} footer={null} width={400}>
				<div style={{ textAlign: "center" }}>
					<QRCode value={data?.id} size={200} />
				</div>
				<div style={{ paddingLeft: 30, marginTop: 20 }}>
					<Row>
						<Col span={12}>RoomName :</Col>
						<Col span={12}>{data?.facility_name}</Col>
					</Row>
					<Row>
						<Col span={12}>Topic :</Col>
						<Col span={12}>{data?.topic}</Col>
					</Row>
					<Row>
						<Col span={12}>Time :</Col>
						<Col span={12}>
							{data ? format(new Date(data?.startDateTime), "HH:mm") : null} - {data ? format(new Date(data?.endDateTime), "HH:mm") : null}
						</Col>
					</Row>
					<Row>
						<Col span={12}>Name - Surname :</Col>
						<Col span={12}>{data?.name}</Col>
					</Row>
					<Row>
						<Col span={12}>Telephone Number :</Col>
						<Col span={12}>{data?.tel}</Col>
					</Row>
					<Row>
						<Col span={12}>Number of People :</Col>
						<Col span={12}>{data?.user_amount}</Col>
					</Row>
					<Row>
						<Col span={12}>Note :</Col>
						<Col span={12}>{data?.note}</Col>
					</Row>
				</div>
				<div style={{ textAlign: "center" }}>
					<Button shape="round" size="large" onClick={null} style={{ width: 200, marginTop: 50 }}>
						Share
					</Button>
				</div>
			</Modal>
		</>
	);
}
