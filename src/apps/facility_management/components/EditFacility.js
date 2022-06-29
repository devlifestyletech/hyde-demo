import React, { useState } from 'react';
import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Row,
  Select,
} from 'antd';
import './styles/facilities.css';
import { DeleteOutlined } from '@ant-design/icons';
import imgIcon from '../assets/img.svg';

//firebase components
import { db } from '../../../utils/firebaseConfig';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { doc, updateDoc } from 'firebase/firestore';

const { TextArea } = Input;
const { Option } = Select;

export default function EditFacility({ id, value, visible, onCancel }) {
	const [editFacilities] = Form.useForm();
	const [pickedImage, setPickedImage] = useState(null);
	const [imageFile, setImageFile] = useState(null);
	const [img, setImg] = useState(true);
	const [dailyStart, setDailyStart] = useState();
	const [dailyStop, setDailyStop] = useState();

	console.log(dailyStart, dailyStop);

	const selectImage = (e) => {
		setImageFile(e.target.files[0]);
		const reader = new FileReader();
		reader.onload = () => {
			if (reader.readyState === 2) {
				setPickedImage(reader.result);
			}
		};
		reader.readAsDataURL(e.target.files[0]);
	};

	const onConfirm = () => {
		Modal.confirm({
			title: 'Are you sure you want to edit facilities?',
			okButtonProps: { shape: 'round', size: 'large', type: 'primary' },
			cancelButtonProps: { shape: 'round', size: 'large' },
			icon: null,
			autoFocusButton: null,
			centered: true,
			onOk() {
				return new Promise((resolve) => {
					const documentRef = doc(db, 'facilities', id);
					if (pickedImage) {
						let file = imageFile;
						const storage = getStorage();
						const storageRef = ref(storage, 'facilities_image/' + file.name);
						uploadBytes(storageRef, file).then((snapshot) => {
							getDownloadURL(snapshot.ref).then((downloadURL) => {
								editFacilities.validateFields().then((val) => {
									console.log(val);
									let newValues = {
										name: val.name,
										accommodates:
											!val.accommodates
												? []
												: val.accommodates.split(','),
										cover: downloadURL,
										daily_start:
											dailyStart !== undefined ? dailyStart : value.daily_start,
										daily_stop:
											dailyStop !== undefined ? dailyStop : value.daily_stop,
										description: val.description,
										detail: val.detail,
										max_hours: val.max_hours,
										max_users: val.max_users,
										rules:
											!val.rules
												? []
												: val.rules.split(','),
									};

									updateDoc(documentRef, newValues)
										.catch((err) => console.error(err))
										.then(() => {
											editFacilities.resetFields();
											setDailyStart();
											setDailyStop();
											resolve('SUCCESS');
											message.success('Save Change Successfully');
											onCancel();
										});
								});
							});
						});
					} else {
						editFacilities.validateFields().then((val) => {
							console.log({ val });
							console.log({ value });
							let newValues = {
								name: val.name,
								accommodates: !val.accommodates
									? []
									: val.accommodates.split(','),
								daily_start:
									dailyStart !== undefined ? dailyStart : value.daily_start,
								daily_stop:
									dailyStop !== undefined ? dailyStop : value.daily_stop,
								description: val.description,
								detail: val.detail,
								max_hours: val.max_hours,
								max_users: val.max_users,
								rules: !val.rules ? [] : val.rules.split(','),
							};
							console.log({ newValues });
							updateDoc(documentRef, newValues)
								.catch((err) => console.error(err))
								.then(() => {
									editFacilities.resetFields();
									setDailyStart();
									setDailyStop();
									resolve('SUCCESS');
									message.success('Save Change Successfully');
									onCancel();
								});
						});
					}
				});
			},
			onCancel() {
				// console.log("Cancel");
				editFacilities.resetFields();
				onCancel();
			},
		});
	};

	const hours = [];
	for (let i = 0; i < 24; i++) {
		hours.push(
			<Option key={i.toString()} value={i}>
				{i.toString().length < 1 ? '0' + i.toString() : i.toString()}:00
			</Option>
		);
	}
	if (value) {
		editFacilities.setFieldsValue({
			name: value.name,
			detail: value.detail,
			max_users: value.max_users,
			max_hours: value.max_hours,
			accommodates: value.accommodates.toString(),
			description: value.description,
			rules: value.rules.toString(),
		});
	}

	return (
		<>
			<Modal
				key={id}
				centered
				visible={visible}
				onCancel={() => {
					editFacilities.resetFields();
					onCancel();
					setImg(true);
				}}
				title="Edit Facilities"
				width={1000}
				footer={[
					<Button
						type="primary"
						size="large"
						shape="round"
						onClick={() => {
							onConfirm();
						}}
					>
						Save
					</Button>,
				]}
			>
				<Form form={editFacilities} layout="vertical">
					<Row>
						<Col span={12} style={{ padding: 10 }}>
							<div className="md-form">
								<Form.Item label="Room Name" name="name">
									<Input />
								</Form.Item>
								<Form.Item label="Room Name Detail" name="detail">
									<Input />
								</Form.Item>
								<Form.Item label="Maximum Total" name="max_users">
									<InputNumber
										min={1}
										style={{ width: '100%', borderRadius: 20 }}
									/>
								</Form.Item>
								<Form.Item label="Maximum Hour" name="max_hours">
									<InputNumber
										min={1}
										style={{ width: '100%', borderRadius: 20 }}
									/>
								</Form.Item>
								<Form.Item label="Daily Hours">
									<div>
										<div style={{ width: '100%', flexDirection: 'row' }}>
											From{' '}
											<Select
												style={{ width: 180 }}
												value={dailyStart}
												defaultValue={value ? value.daily_start : null}
												onChange={setDailyStart}
											>
												{hours}
											</Select>{' '}
											To{' '}
											<Select
												style={{ width: 180 }}
												value={dailyStop}
												defaultValue={value ? value.daily_stop : null}
												onChange={setDailyStop}
											>
												{hours}
											</Select>
										</div>
									</div>
								</Form.Item>
								<Form.Item
									label="Accommodates (Please split accommodate item with comma',')"
									name="accommodates"
								>
									<TextArea autoSize={{ minRows: 2, maxRows: 5 }} />
								</Form.Item>
							</div>
						</Col>
						<Col span={12} style={{ padding: 10 }}>
							<div className="md-form">
								<Form.Item label="Description" name="description">
									<TextArea autoSize={{ minRows: 3, maxRows: 5 }} />
								</Form.Item>
								<Form.Item
									label="Rules (Please split rule item with comma',')"
									name="rules"
								>
									<TextArea autoSize={{ minRows: 2, maxRows: 5 }} />
								</Form.Item>
								<Form.Item label="Image">
									<div>
										{img ? (
											<>
												<img
													className="facility-image"
													src={value ? value.cover : null}
													alt="bg"
												/>
												<Button
													icon={<DeleteOutlined />}
													type="link"
													style={{ float: 'right' }}
													onClick={() => setImg(false)}
												>
													Change Image
												</Button>
											</>
										) : (
											<>
												{!pickedImage ? (
													<>
														<label htmlFor="input">
															<div className="facility-image">
																<img
																	src={imgIcon}
																	alt="bg"
																	style={{ marginTop: 80 }}
																/>
																<p>Click to upload image</p>
															</div>
														</label>
														<input
															type="file"
															id="input"
															accept="image/*"
															onChange={selectImage}
															onClick={(event) => {
																event.target.value = null;
															}}
															style={{
																display: 'none',
																float: 'left',
															}}
														/>
														<p style={{ color: 'red' }}>
															* Please upload image
														</p>
													</>
												) : (
													<div>
														<img
															className="facility-image"
															src={pickedImage}
															alt="picked"
														/>
														<Button
															type="link"
															icon={<DeleteOutlined />}
															onClick={() => setPickedImage(null)}
															style={{ float: 'right' }}
														>
															Change image
														</Button>
													</div>
												)}
											</>
										)}
									</div>
								</Form.Item>
							</div>
						</Col>
					</Row>
				</Form>
			</Modal>
		</>
	);
}
