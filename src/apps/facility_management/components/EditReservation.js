import React from "react";
import { Modal, Button, Row, Col, Form, Select, Input, InputNumber, DatePicker } from "antd";

const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

export default function EditReservation({ id, visible, onCancel }) {
	const onConfirm = () => {
		Modal.confirm({
			centered: true,
			title: "Are you sure you want to edit booking?",
			okButtonProps: { shape: "round", size: "large", type: "primary" },
			cancelButtonProps: { shape: "round", size: "large" },
			icon: null,
			autoFocusButton: null,
			onOk() {
				console.log("OK");
				onCancel();
			},
			onCancel() {
				console.log("Cancel");
			}
		});
	};

	const [createReservation] = Form.useForm();

	return (
		<>
			<Modal
				centered
				width={1000}
				title='Edit Reservation'
				visible={visible}
				onCancel={() => onCancel()}
				footer={[
					<Button size='large' shape='round' type='primary' onClick={() => onConfirm()}>
						Create
					</Button>
				]}>
				<Form form={createReservation} layout='vertical'>
					<Row>
						<Col span={12} style={{ padding: 10 }}>
							<div className='md-form'>
								<div className='form-group'>
									<Form.Item label='Booked'>
										<Select placeholder='Please select booked'>
											<Option value='resident'>Resident</Option>
											<Option value='Juristic'>Juristic</Option>
											<Option value='Other'>Other</Option>
										</Select>
									</Form.Item>
									<Form.Item label='Room Name'>
										<Select style={{ width: "100%", float: "left" }} defaultValue='0' placeholder='Please select room name'>
											<Option value='0'>Private Chef Table</Option>
											<Option value='1'>Spa, Manicure & Pedicure</Option>
											<Option value='2'>Co-Working Space</Option>
											<Option value='3'>Library</Option>
											<Option value='4'>Theater Room</Option>
											<Option value='5'>Glass House</Option>
											<Option value='6'>Experiential Golf Simulator</Option>
										</Select>
									</Form.Item>
									<Form.Item label='Topic'>
										<Input placeholder='Please input topic' />
									</Form.Item>
									<Form.Item label='Number of people'>
										<InputNumber min={1} style={{ width: "100%", borderRadius: 20 }} />
									</Form.Item>
									<Form.Item label='Room Number'>
										<Input />
									</Form.Item>
									<Form.Item label='Name-Surname'>
										<Input />
									</Form.Item>
								</div>
							</div>
						</Col>
						<Col span={12} style={{ padding: 10 }}>
							<div className='md-form'>
								<div className='form-group'>
									<Form.Item label='Telephone Number'>
										<Input />
									</Form.Item>
									<Form.Item label='Select the time to schedule'>
										<RangePicker showTime />
									</Form.Item>
									<Form.Item label='Note'>
										<TextArea placeholder='' autoSize={{ minRows: 3, maxRows: 6 }} />
									</Form.Item>
								</div>
							</div>
						</Col>
					</Row>
				</Form>
			</Modal>
		</>
	);
}
