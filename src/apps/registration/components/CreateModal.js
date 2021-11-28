import React, { useState } from "react";
import { Modal, Button, Form, Row, Col, Input, Space, DatePicker, Select, Textarea } from "antd";
import "./styles/ModalStyle.css";
import ImageIcon from "../assets/icons/image.svg";
import { DeleteOutlined, SearchOutlined } from "@ant-design/icons";

function CreateModal({ visible, onCancel }) {
	const [CreateResidentForm] = Form.useForm();
	const [imageFile, setImageFile] = useState(null);
	const [pickedImage, setPickedImage] = useState(null);

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

	return (
		<Modal
			title='Add New'
			visible={visible}
			onCancel={() => {
				onCancel();
				setPickedImage(null);
			}}
			width={950}
			footer={[
				<Button
					shape='round'
					size='large'
					style={{ background: "rgba(216, 170, 129, 1)", color: "rgba(255, 255, 255,1)" }}
					onClick={() => {
						onCancel();
						setPickedImage(null);
					}}>
					Add
				</Button>
			]}>
			<Form form={CreateResidentForm} layout='vertical'>
				<Row gutter={40} style={{ padding: 20 }}>
					<Col span={12}>
						<div className='md-form'>
							<div className='select-img'>
								{pickedImage ? null : (
									<div className='avatar'>
										<label htmlFor='input'>
											<img src={ImageIcon} alt='upload' className='img-upload' />
											<p style={{ color: "white", fontSize: 18 }}>Click to upload image</p>
										</label>
									</div>
								)}
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
								{pickedImage ? (
									<div className='picked-avatar'>
										<img className='picked-avatar-image' src={pickedImage} alt='picked' />
									</div>
								) : null}
							</div>
							<Form.Item label='First Name'>
								<Input placeholder='Please input first name' />
							</Form.Item>
							<Form.Item label='Last Name'>
								<Input placeholder='Please input last name' />
							</Form.Item>
							<Form.Item label='Date of Birth'>
								<Space direction='horizontal'>
									<DatePicker placeholder='Please select date' style={{ width: 410, borderRadius: 20 }} />
								</Space>
							</Form.Item>
							<Form.Item label='Gender'>
								<Select placeholder='Please select gender' style={{ borderRadius: 20 }}>
									<Select.Option value='male'>Male</Select.Option>
									<Select.Option value='female'>Female</Select.Option>
								</Select>
							</Form.Item>
							<Form.Item label='Nationality'>
								<Input placeholder='Please select nationality' />
							</Form.Item>
						</div>
					</Col>
					<Col span={12}>
						<div className='md-form'>
							<Form.Item label='ID Number'>
								<Input placeholder='Please input id card' />
							</Form.Item>
							<Form.Item label='Passport Number'>
								<Input placeholder='Please input passport number' />
							</Form.Item>
							<Form.Item label='Address'>
								<Input placeholder='Please input address' />
							</Form.Item>
							<Form.Item label='Resident Class'>
								<Select placeholder="Please select resident class">
									<Select.Option value="privilege">rivilege</Select.Option>
									<Select.Option value="general">General</Select.Option>
								</Select>
							</Form.Item>
							<Form.Item label='Resident Type'>
								<Select placeholder="Please select resident type">
									<Select.Option value="Owner">Owner</Select.Option>
									<Select.Option value="Inhabitant">Inhabitant</Select.Option>
									<Select.Option value="Tenant">Tenant</Select.Option>
								</Select>
							</Form.Item>
							<Form.Item label='Telephone Number'>
								<Input placeholder='Please input phone number' />
							</Form.Item>
							<Form.Item label='E-mail'>
								<Input placeholder='Please input email' />
							</Form.Item>
							<Form.Item label='Vehicle Type'>
								<Select placeholder="Please select vehicle type">
									<Select.Option value="car">Car</Select.Option>
									<Select.Option value="bike">Bike</Select.Option>
								</Select>
							</Form.Item>
							<Form.Item label='License Plate'>
								<Input placeholder='Please input license plate' />
							</Form.Item>
						</div>
					</Col>
				</Row>
			</Form>
		</Modal>
	);
}

export default CreateModal;
