import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Input, Row, Col, Select, message, DatePicker } from "antd";
import "./styles/ModalStyle.css";
import moment from "moment";
import { ExclamationCircleOutlined, DeleteOutlined } from "@ant-design/icons";
import ImageIcon from "../assets/icons/image.svg";
import { locale } from "../../../utils/locale";
import addressService from "../../../services/address.service";
import authService from "../../../services/auth.service";
import uploadService from "../../../services/upload.service";
const { Option } = Select;

export default function EditModal({ user, visible, onCancel }) {
	const [EditResidentForm] = Form.useForm();
	const [pickedImage, setPickedImage] = useState(null);
	const [img, setImg] = useState(true);
	const [imageFile, setImageFile] = useState(null);

	const [addresses, setAddresses] = useState();

	useEffect(() => {
		setImg(true);
		addressService.getAllAddresses().then((res) => setAddresses(res.data));
	}, []);
	
	if (user) {
		// if (user.image !== undefined) {
		// 	setPickedImage(`${process.env.REACT_APP_API_URL}${user.image.url}`);
		// }
		EditResidentForm.setFieldsValue({
			firstname: user.firstname,
			lastname: user.lastname,
			birth_day: moment(user.birth_day),
			gender: user.gender,
			nationality: user.nationality,
			tel: user.tel,
			lp_number: user.lp_number,
			id_number: user.id_number,
			passport_number: user.passport_number,
			address: user.address.id,
			resident_type: user.resident_type,
			resident_class: user.resident_class,
			vehicle_type: user.vehicle_type,
			email: user.email
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

	function showConfirm(value, imageData) {
		Modal.confirm({
			centered: true,
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
				if (pickedImage) {
					uploadService.uploadImage(imageData).then((res) => {
						let new_value = { image: res.data[0], ...value };
						console.log(new_value);
						authService.editUserData(user.id, new_value).then(() => {
							message.success("Save finished");
							onCancel();
						});
					});
				} else {
					let new_value = { image: "61bab50dbbf38e05d8a666fd", ...value };
					authService.editUserData(user.id, new_value).then(() => {
						message.success("Save finished");
						onCancel();
					});
				}
			},
			onCancel() {
				onCancel();
			}
		});
	}

	return (
		<div className='create_modal'>
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
							let imageData = new FormData();
							imageData.append("files", imageFile);
							EditResidentForm.validateFields().then((value) => {
								let submit_value = {
									email: value.email,
									fullname: value.firstname + " " + value.lastname,
									firstname: value.firstname,
									lastname: value.lastname,
									tel: value.tel,
									lp_number: value.lp_number,
									birth_day: value.birth_day.toISOString(),
									gender: value.gender,
									nationality: value.nationality,
									id_number: value.id_number,
									passport_number: value.passport_number,
									address: value.address,
									resident_type: value.resident_type,
									resident_class: value.resident_class,
									vehicle_type: value.vehicle_type
								};
								console.log(submit_value);
								showConfirm(submit_value, imageData);
							});
						}}>
						Save Change
					</Button>
				]}>
				<Form form={EditResidentForm} layout='vertical'>
					<Row gutter={40} style={{ padding: 20 }}>
						<Col span={12}>
							<div className='md-form'>
								<Form.Item label='Image'>
									{img ? (
										<div className='picked-avatar'>
											<img className='picked-avatar-image' src={process.env.REACT_APP_API_URL + user?.image.url} alt='picked' />
											<Button type='link' icon={<DeleteOutlined />} onClick={() => setImg(null)} style={{ float: "right" }}>
												Change image
											</Button>
										</div>
									) : (
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
													<Button type='link' icon={<DeleteOutlined />} onClick={() => setPickedImage(null)} style={{ float: "right" }}>
														Change image
													</Button>
												</div>
											) : null}
											{!pickedImage ? <p style={{ color: "red" }}>* Please upload image</p> : null}
										</div>
									)}
								</Form.Item>

								<Form.Item
									label='First Name'
									name='firstname'
									rules={[
										{
											required: true,
											message: "Please input firstname!"
										}
									]}>
									<Input placeholder='Please input first name' />
								</Form.Item>
								<Form.Item
									label='Last Name'
									name='lastname'
									rules={[
										{
											required: true,
											message: "Please input lastname!"
										}
									]}>
									<Input placeholder='Please input last name' />
								</Form.Item>
								<Form.Item
									label='Date of Birth'
									name='birth_day'
									rules={[
										{
											required: true,
											message: "Please select date of birth!"
										}
									]}>
									<DatePicker placeholder='Please select date' style={{ width: 410, borderRadius: 20 }} />
								</Form.Item>
								<Form.Item
									label='Gender'
									name='gender'
									rules={[
										{
											required: true,
											message: "Please select gender!"
										}
									]}>
									<Select placeholder='Please select gender' style={{ borderRadius: 20 }}>
										<Select.Option key={"male"} value='Male'>
											Male
										</Select.Option>
										<Select.Option key={"female"} value='Female'>
											Female
										</Select.Option>
									</Select>
								</Form.Item>
								<Form.Item
									label='Nationality'
									name='nationality'
									rules={[
										{
											required: true,
											message: "Please select country!"
										}
									]}>
									<Select
										placeholder='Type to search and select country'
										showSearch
										filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
										{locale.map((country, index) => (
											<Option key={index} value={country["ISO CODES"]}>
												{country["COUNTRY"]}
											</Option>
										))}
									</Select>
								</Form.Item>
							</div>
						</Col>
						<Col span={12}>
							<div className='md-form'>
								<Form.Item
									label='ID Number'
									name='id_number'
									rules={[
										{
											required: true,
											message: "Please input ID Card number!"
										}
									]}>
									<Input placeholder='Please input id card' />
								</Form.Item>
								<Form.Item label='Passport Number' name='passport_number'>
									<Input placeholder='Please input passport number' />
								</Form.Item>
								<Form.Item label='Address' name='address'>
									<Select
										showSearch
										filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
										placeholder='Please select address'>
										{addresses
											? addresses.map((address, index) => (
												<Option key={index} value={address.id}>
													{address.address_number}
												</Option>
											))
											: null}
									</Select>
								</Form.Item>
								<Form.Item
									label='Resident Class'
									rules={[
										{
											required: true,
											message: "Please select resident class!"
										}
									]}
									name='resident_class'>
									<Select placeholder='Please select resident class'>
										<Select.Option key={"privilege"} value='Privilege'>
											Privilege
										</Select.Option>
										<Select.Option key={"general"} value='General'>
											General
										</Select.Option>
									</Select>
								</Form.Item>
								<Form.Item
									label='Resident Type'
									name='resident_type'
									rules={[
										{
											required: true,
											message: "Please select resident type!"
										}
									]}>
									<Select placeholder='Please select resident type'>
										<Select.Option key={"owner"} value='Owner'>
											Owner
										</Select.Option>
										<Select.Option key={"inhabitant"} value='Inhabitant'>
											Inhabitant
										</Select.Option>
										<Select.Option key={"tenant"} value='Tenant'>
											Tenant
										</Select.Option>
									</Select>
								</Form.Item>
								<Form.Item
									label='Telephone Number'
									name='tel'
									rules={[
										{
											required: true,
											message: "Please input phone number!"
										}
									]}>
									<Input placeholder='Please input phone number' />
								</Form.Item>
								<Form.Item
									label='E-mail'
									name='email'
									rules={[
										{
											required: true,
											message: "Please input email!"
										}
									]}>
									<Input placeholder='Please input email' />
								</Form.Item>
								<Form.Item label='Vehicle Type' name='vehicle_type'>
									<Select placeholder='Please select vehicle type'>
										<Select.Option key={"car"} value='Car'>
											Car
										</Select.Option>
										<Select.Option key={"bike"} value='Bike'>
											Bike
										</Select.Option>
									</Select>
								</Form.Item>
								<Form.Item label='License Plate' name='lp_number'>
									<Input placeholder='Please input license plate' />
								</Form.Item>
							</div>
						</Col>
					</Row>
				</Form>
			</Modal>
		</div>
	);
}
