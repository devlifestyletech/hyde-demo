import React from "react";
import { Modal, Form, Row, Col, Input, InputNumber, DatePicker, Button, message } from "antd";
import "./styles/facilities.css";
import { DeleteOutlined } from "@ant-design/icons";
import imgIcon from "../assets/img.svg";
import imgBg from "../assets/er.png";
const { RangePicker } = DatePicker;
const { TextArea } = Input;

export default function EditFacility({ id, visible, onCancel }) {
	const [editFacilities] = Form.useForm();
	const [pickedImage, setPickedImage] = React.useState(null);
	const [imageFile, setImageFile] = React.useState(null);
	const [img, setImg] = React.useState(true);

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

	const onConfirm = () => {
		Modal.confirm({
			title: "Are you sure you want to edit facilities?",
			okButtonProps: { shape: "round", size: "large", type: "primary" },
			cancelButtonProps: { shape: "round", size: "large" },
			icon: null,
			autoFocusButton: null,
			centered: true,
			onOk() {
				message.success("Save Change Successfully");
				onCancel();
			},
			onCancel() {
				console.log("Cancel");
			}
		});
	};

	return (
		<>
			<Modal
				centered
				visible={visible}
				onCancel={() => {
					onCancel();
					setImg(true);
				}}
				title='Edit Facilities'
				width={1000}
				footer={[
					<Button
						type='primary'
						size='large'
						shape='round'
						onClick={() => {
							onConfirm();
						}}>
						Save
					</Button>
				]}>
				<Form form={editFacilities} layout='vertical'>
					<Row>
						<Col span={12} style={{ padding: 10 }}>
							<div className='md-form'>
								<Form.Item label='Room Name'>
									<Input />
								</Form.Item>
								<Form.Item label='Room Name Detail'>
									<Input />
								</Form.Item>
								<Form.Item label='Maximum Total'>
									<InputNumber min={0.5} style={{ width: "100%", borderRadius: 20 }} />
								</Form.Item>
								<Form.Item label='Maximum Hour'>
									<InputNumber min={0.5} style={{ width: "100%", borderRadius: 20 }} />
								</Form.Item>
								<Form.Item label='Daily Hour'>
									<RangePicker picker='time' />
								</Form.Item>
								<Form.Item label='Accommodates'>
									<TextArea autoSize={{ minRows: 2, maxRows: 5 }} />
								</Form.Item>
							</div>
						</Col>
						<Col span={12} style={{ padding: 10 }}>
							<div className='md-form'>
								<Form.Item label='Description'>
									<TextArea autoSize={{ minRows: 3, maxRows: 5 }} />
								</Form.Item>
								<Form.Item label='Rules'>
									<TextArea autoSize={{ minRows: 2, maxRows: 5 }} />
								</Form.Item>
								<Form.Item label='Image'>
									<div>
										{img ? (
											<>
												<img className='facility-image' src={imgBg} alt='bg' />
												<Button icon={<DeleteOutlined />} type='link' style={{ float: "right" }} onClick={() => setImg(false)}>
													Change Image
												</Button>
											</>
										) : (
											<>
												{!pickedImage ? (
													<>
														<label htmlFor='input'>
															<div className='facility-image'>
																<img src={imgIcon} alt='bg' style={{ marginTop: 80 }} />
																<p>Click to upload image</p>
															</div>
														</label>
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
														<p style={{ color: "red" }}>* Please upload image</p>
													</>
												) : (
													<div>
														<img className='facility-image' src={pickedImage} alt='picked' />
														<Button type='link' icon={<DeleteOutlined />} onClick={() => setPickedImage(null)} style={{ float: "right" }}>
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
