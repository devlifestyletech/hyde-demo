import React, { useState } from "react";
import { Modal, Button, Form, Input, Row, Col, Select, Space, DatePicker } from "antd";
import "./styles/ModalStyle.css";
import moment from "moment";
import { ExclamationCircleOutlined } from "@ant-design/icons";

export default function EditModal({ user, visible, onCancel }) {
	const [EditResidentForm] = Form.useForm();
	const [pickedImage, setPickedImage] = useState(null);
	const [imageFile, setImageFile] = useState(null);

	console.log(user);

	if (user) {
		EditResidentForm.setFieldsValue({
			firstName: user.firstname,
			lastName: user.lastname,
			dateOfBirth: moment(user.dateOfBirth),
			gender: user.gender,
			nationality: user.nationality,
			idNumber: user.idNumber,
			passportNumber: user.passportNumber,
			address: user.address,
			userClass: user.userClass,
			type: user.type,
			tel: user.tel,
			email: user.email,
			vehicleType: user.vehicleType,
			licensePlate: user.licensePlate
		});
	}
	const selectImage = (e) => {
		setImageFile(e.target.files[0]);
		const reader = new FileReader();
		reader.onload = (e) => {
			if (reader.readyState === 2) {
				setPickedImage(reader.result);
			}
		};
		reader.readAsDataURL(e.target.files[0]);
	};

	function showConfirm() {
		Modal.confirm({
			title: "Do you Want to save these change?",
			icon: <ExclamationCircleOutlined />,
			content: "That all your change will update",
			bodyStyle: {
				borderRadius: 20
			},
			okText: "Save",
			okButtonProps: { shape: "round" },
			cancelButtonProps: { shape: "round" },
			onOk() {
				onCancel();
			},
			onCancel() {
				onCancel();
			}
		});
	}

	return (
		<Modal
			visible={visible}
			onCancel={() => onCancel()}
			title='Edit Resident data'
			width={950}
			footer={[
				<Button style={{ background: "rgba(216, 170, 129, 1)", color: "rgba(255, 255, 255,1)" }} shape='round' size='large' onClick={showConfirm}>
					Save Change
				</Button>
			]}>
			<Form form={EditResidentForm} layout='vertical'>
				<Row gutter={40} style={{ padding: 20 }}>
					<Col span={12}>
						<div className='md-form'>
							<div className='select-img'>
								<input
									type='file'
									id='input'
									accept='image/*'
									onChange={selectImage}
									onClick={(event) => {
										event.target.value = null;
									}}
									style={{
										display: "none",
										float: "left"
									}}
								/>
								<div className='picked-avatar'>{user ? <img className='picked-avatar-image' src={user.avatar} alt='avatar' /> : null}</div>
							</div>
							<Form.Item label='First Name' name='firstName'>
								<Input />
							</Form.Item>
							<Form.Item label='Last Name' name='lastName'>
								<Input />
							</Form.Item>
							<Form.Item label='Date of Birth' name='dateOfBirth'>
								<Space direction='horizontal'>
									<DatePicker style={{ width: 410, borderRadius: 20 }} />
								</Space>
							</Form.Item>
							<Form.Item label='Gender' name='gender'>
								<Select>
									<Select.Option value='male'>Male</Select.Option>
									<Select.Option value='female'>Female</Select.Option>
								</Select>
							</Form.Item>
							<Form.Item label='Nationality' name='nationality'>
								<Input />
							</Form.Item>
						</div>
					</Col>
					<Col span={12}>
						<div className='md-form'>
							<Form.Item label='ID Number' name='idNumber'>
								<Input />
							</Form.Item>
							<Form.Item label='Passport Number' name='passportNumber'>
								<Input />
							</Form.Item>
							<Form.Item label='Address' name='address'>
								<Input />
							</Form.Item>
							<Form.Item label='Resident Class' name='userClass'>
								<Input />
							</Form.Item>
							<Form.Item label='Resident Type' name='type'>
								<Input />
							</Form.Item>
							<Form.Item label='Telephone Number' name='tel'>
								<Input />
							</Form.Item>
							<Form.Item label='E-mail' name='email'>
								<Input />
							</Form.Item>
							<Form.Item label='Vehicle Type' name='vehicleType'>
								<Input />
							</Form.Item>
							<Form.Item label='License Plate' name='licensePlate'>
								<Input />
							</Form.Item>
						</div>
					</Col>
				</Row>
			</Form>
		</Modal>
	);
}
