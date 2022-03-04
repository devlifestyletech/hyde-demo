import React, { useRef } from 'react'
import QRCode from 'qrcode.react'
import { Modal, Row, Col, Button } from 'antd'
import { ShareAltOutlined, DownloadOutlined } from '@ant-design/icons'
import { format } from 'date-fns'
import { exportComponentAsJPEG } from 'react-component-export-image'
import qrlogo from '../assets/hyde_2.svg'

export default function QrModal({ data, visible, onCancel }) {
	const qrRef = useRef()
	return (
		<>
			<Modal centered title='Reservation' visible={visible} onCancel={() => onCancel()} footer={null} width={400}>
				<div style={{ textAlign: 'center', width: 350, height: 350, backgroundColor: 'white', padding: 25 }} ref={qrRef}>
					<QRCode value={data?.id} size={300} imageSettings={{ src: qrlogo, height: 50, width: 50, excavate: false }} />
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
							{data ? format(data?.startDateTime.toDate(), 'HH:mm') : null} - {data ? format(data.endDateTime.toDate(), 'HH:mm') : null}
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
				<div style={{ textAlign: 'center' }}>
					<Button shape='round' size='large' onClick={null} style={{ width: 200, marginTop: 50 }} icon={<ShareAltOutlined />}>
						Share
					</Button>
					<Button shape='round' size='large' onClick={() => exportComponentAsJPEG(qrRef, { fileName: data?.name + '-' + data?.id })} style={{ width: 200, marginTop: 10 }} icon={<DownloadOutlined />}>
						Save Image
					</Button>
				</div>
			</Modal>
		</>
	)
}
