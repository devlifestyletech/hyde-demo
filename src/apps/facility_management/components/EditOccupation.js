import React from "react";
import { Modal, Button, Form, Input, InputNumber } from "antd";

import { DeleteOutlined } from "@ant-design/icons";
import imgIcon from "../assets/img.svg";
import imgBg from "../assets/img/no_img.png";

export default function EditOccupation({ id, visible, onCancel }) {
	const [pickedImage, setPickedImage] = React.useState(null);
	const [imageFile, setImageFile] = React.useState(null);
	const [img, setImg] = React.useState(true);

	const onConfirm = () => {
		Modal.confirm({
			centered: true,
			title: "Are you sure you want to edit occupation?",
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
		<>
			<Modal
				centered
				visible={visible}
				title='Edit Occupation'
				onCancel={() => onCancel()}
				footer={[
					<Button shape='round' size='large' type='primary' onClick={() => onConfirm()}>
						Save Change
					</Button>
				]}>
				<Form layout='vertical'>
					<div className='md-form'>
						<Form.Item label='Room Name'>
							<Input />
						</Form.Item>
						<Form.Item label='Room Detail'>
							<Input />
						</Form.Item>
						<Form.Item label='Number of People : Low Status'>
							<InputNumber min={1} style={{ width: "80%", borderRadius: 20, marginRight: 20 }} /> Persons
						</Form.Item>
						<Form.Item label='Number of People : Medium Status'>
							<InputNumber min={1} style={{ width: "80%", borderRadius: 20, marginRight: 20 }} /> Persons
						</Form.Item>
						<Form.Item label='Number of People : High Status'>
							<InputNumber min={1} style={{ width: "80%", borderRadius: 20, marginRight: 20 }} /> Persons
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
				</Form>
			</Modal>
		</>
	);
}
