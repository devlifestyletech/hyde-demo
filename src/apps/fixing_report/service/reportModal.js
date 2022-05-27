/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { Button, Image, Input, Row, Col, DatePicker, Form, Modal, Select } from 'antd';
import { PictureOutlined } from '@ant-design/icons';
import axios from 'axios';
import moment from 'moment';
import { format, utcToZonedTime } from 'date-fns-tz';
import { encryptStorage } from '../../../utils/encryptStorage';
const session = encryptStorage.getItem('user_session');

export default function ReportModal({ visible, reportValue, fetchData, closeModal }) {
	const URLreScript = process.env.REACT_APP_API_URL + '/fixing-reports';
	const headers = { headers: { Authorization: 'Bearer ' + session.jwt } };
	const thTimeZone = 'Asia/Bangkok';
	const { Option } = Select;
	const status = { Pending: '#E86A6B', Repairing: '#EEC84D', Success: '#79CA6C' };
	const [form] = Form.useForm();
	const [reportStatus, setReportStatus] = useState(reportValue.status);
	const [repairReq, setRepairReq] = useState(true);
	const [successReq, setSuccessReq] = useState(true);
	const [pendingImg, setPendingImg] = useState([]);
	const [repairingImg, setRepairingImg] = useState([]);
	const [successImg, setSuccessImg] = useState([]);
	const [pendingImgFile, setPendingImgFile] = useState([]);
	const [repairingImgFile, setRepairingImgFile] = useState([]);
	const [successImgFile, setSuccessImgFile] = useState([]);
	console.log('Modal Value', reportValue);
	const handleValue = () => {
		form.setFieldsValue({
			pick_up_date: reportValue.pick_up_date ? moment(format(utcToZonedTime(new Date(reportValue.pick_up_date), thTimeZone), 'yyyy-MM-dd', { timeZone: 'Asia/Bangkok' })) : '',
			opening_date: reportValue.opening_date ? moment(format(utcToZonedTime(new Date(reportValue.opening_date), thTimeZone), 'yyyy-MM-dd', { timeZone: 'Asia/Bangkok' })) : '',
			closing_date: reportValue.closing_date ? moment(format(utcToZonedTime(new Date(reportValue.closing_date), thTimeZone), 'yyyy-MM-dd', { timeZone: 'Asia/Bangkok' })) : '',
			status: reportStatus,
			cause: reportValue.cause,
			solution: reportValue.solution,
		});
	};

	useEffect(() => {
		handleValue();
	}, []);

	useEffect(() => {
		if (reportStatus === 'Repairing') {
			setRepairReq(false);
			setSuccessReq(true);
		} else if (reportStatus === 'Success') {
			setRepairReq(false);
			setSuccessReq(false);
		} else {
			setRepairReq(true);
			setSuccessReq(true);
		}
	}, [reportStatus]);

	const imagePreviewSty = {
		border: '1px solid #959595',
		borderRadius: '10px',
		margin: '4px',
		width: '16vh',
		height: '16vh',
	};

	function statusHandle(status) {
		console.log('statusHandle', status);
		setReportStatus(status);
	}

	const selectPendingImg = (e) => {
		setPendingImgFile([...pendingImgFile, e.target.files[0]]);
		const reader = new FileReader();
		reader.onload = () => {
			if (reader.readyState === 2 && pendingImg.length < 4) {
				console.log('indexOf', pendingImg.indexOf(reader.result));
				if (pendingImg.indexOf(reader.result) < 0) {
					setPendingImg([...pendingImg, reader.result]);
				} else {
					alert('This image is repeated.');
				}
			}
		};
		reader.readAsDataURL(e.target.files[0]);
	};

	const selectRepairingImg = (e) => {
		setRepairingImgFile([...repairingImgFile, e.target.files[0]]);
		const reader = new FileReader();
		reader.onload = () => {
			if (reader.readyState === 2 && repairingImg.length < 4) {
				console.log('indexOf', repairingImg.indexOf(reader.result));
				if (repairingImg.indexOf(reader.result) < 0) {
					setRepairingImg([...repairingImg, reader.result]);
				} else {
					alert('This image is repeated.');
				}
			}
		};
		reader.readAsDataURL(e.target.files[0]);
	};

	const selectSuccessImg = (e) => {
		setSuccessImgFile([...successImgFile, e.target.files[0]]);
		const reader = new FileReader();
		reader.onload = () => {
			if (reader.readyState === 2 && successImg.length < 4) {
				console.log('indexOf', successImg.indexOf(reader.result));
				if (successImg.indexOf(reader.result) < 0) {
					setSuccessImg([...successImg, reader.result]);
				} else {
					alert('This image is repeated.');
				}
			}
		};
		reader.readAsDataURL(e.target.files[0]);
	};

	const handleEditReport = async (value) => {
		console.log('value', value, value.key);

		axios
			.put(
				`${URLreScript}/${reportValue.key}`,
				{
					pick_up_date: value.pick_up_date ? `${value.pick_up_date.format('yyyy-MM-DD')}T00:00:00.000+07:00` : '',
					opening_date: value.opening_date ? `${value.opening_date.format('yyyy-MM-DD')}T00:00:00.000+07:00` : '',
					closing_date: value.closing_date ? `${value.closing_date.format('yyyy-MM-DD')}T00:00:00.000+07:00` : '',
					status: reportStatus,
					cause: value.cause,
					solution: value.solution,
				},
				headers,
			)
			.then((res) => {
				console.log('res', res);
				if (pendingImgFile.length > 0 && repairingImgFile.length > 0 && successImgFile.length > 0) {
					uploadImg();
				} else {
					uploadImg();
					fetchData();
					closeModal();
				}
			})
			.catch((err) => {
				console.error("Can't add data: ", err);
			});
	};

	const uploadImg = async () => {
		if (pendingImgFile.length > 0) {
			let arr = [];
			reportValue.image_pending.map((item) => arr.push(item));
			for (let i = 0; i < pendingImgFile.length; i++) {
				let dataImage = new FormData();
				dataImage.append('files', pendingImgFile[i]);
				console.log('dataImage', dataImage);
				console.log('pendingImgFile', i, pendingImgFile[i]);
				dataImage
					? await axios
							.post(process.env.REACT_APP_API_URL + '/upload/', dataImage, headers)
							.then((res) => {
								let imageId = res.data[0];
								console.log('imageId', imageId);
								arr.push(imageId);
								console.log('arr', arr);
								axios
									.put(
										`${URLreScript}/${reportValue.key}`,
										{
											image_pending: arr,
										},
										headers,
									)
									.then((res) => {
										fetchData();
										closeModal();
									})
									.catch((err) => {
										console.error("Can't add data: ", err);
									});
							})
							.catch((err) => {
								//console.log("ERROR", err);
							})
					: alert('noImage');
			}
		}
		if (repairingImgFile.length > 0) {
			let arr = [];
			reportValue.image_repairing.map((item) => arr.push(item));
			for (let i = 0; i < repairingImgFile.length; i++) {
				let dataImage = new FormData();
				dataImage.append('files', repairingImgFile[i]);
				console.log('dataImage', dataImage);
				console.log('repairingImgFile', i, repairingImgFile[i]);
				dataImage
					? await axios
							.post(process.env.REACT_APP_API_URL + '/upload/', dataImage, headers)
							.then((res) => {
								let imageId = res.data[0];
								console.log('imageId', imageId);
								arr.push(imageId);
								console.log('arr', arr);
								axios
									.put(
										`${URLreScript}/${reportValue.key}`,
										{
											image_repairing: arr,
										},
										headers,
									)
									.then((res) => {
										fetchData();
										closeModal();
									})
									.catch((err) => {
										console.error("Can't add data: ", err);
									});
							})
							.catch((err) => {
								console.log('ERROR', err);
							})
					: alert('noImage');
			}
		}
		if (successImgFile.length > 0) {
			let arr = [];
			reportValue.image_success.map((item) => arr.push(item));
			for (let i = 0; i < successImgFile.length; i++) {
				let dataImage = new FormData();
				dataImage.append('files', successImgFile[i]);
				console.log('dataImage', dataImage);
				console.log('successImgFile', i, successImgFile[i]);
				dataImage
					? await axios
							.post(process.env.REACT_APP_API_URL + '/upload/', dataImage, headers)
							.then((res) => {
								let imageId = res.data[0];
								console.log('imageId', imageId);
								arr.push(imageId);
								console.log('arr', arr);
								axios
									.put(
										`${URLreScript}/${reportValue.key}`,
										{
											image_success: arr,
										},
										headers,
									)
									.then((res) => {
										fetchData();
										closeModal();
									})
									.catch((err) => {
										console.error("Can't add data: ", err);
									});
							})
							.catch((err) => {
								console.log('ERROR', err);
							})
					: alert('noImage');
			}
		}
	};

	const PendingImages = () => {
		return (
			<Row>
				{reportValue.image_pending.map((item, index) => {
					return <Image style={imagePreviewSty} src={process.env.REACT_APP_API_URL + item.url} alt={'reportPendingImg' + index} />;
				})}
				{pendingImg.map((item, index) => {
					return <Image style={imagePreviewSty} src={item} alt={'pendingImg' + index} />;
				})}
				{reportValue.image_pending.length + pendingImg.length < 3 ? (
					<div className='inputReportImage'>
						<label htmlFor='inputPending'>
							<div
								class='child'
								style={{
									width: '16vh',
									height: '16vh',
									textAlign: 'center',
									fontSize: 10,
								}}
							>
								<Col>
									<PictureOutlined
										style={{
											width: '16vh',
											height: '20px',
											fontSize: 32,
											color: '#818282',
										}}
									/>
									Click to this area to upload
								</Col>
							</div>
						</label>
					</div>
				) : null}
			</Row>
		);
	};

	const RepairingImages = () => {
		return (
			<Row>
				{reportValue.image_repairing.map((item, index) => {
					return <Image style={imagePreviewSty} src={process.env.REACT_APP_API_URL + item.url} alt={'reportRepairingImg' + index} />;
				})}
				{repairingImg.map((item, index) => {
					return <Image style={imagePreviewSty} src={item} alt={'repairingImg' + index} />;
				})}
				{reportValue.image_repairing.length + repairingImg.length < 3 ? (
					<div className='inputReportImage'>
						<label htmlFor='inputRepairing'>
							<div
								class='child'
								style={{
									width: '16vh',
									height: '16vh',
									textAlign: 'center',
									fontSize: 10,
								}}
							>
								<Col>
									<PictureOutlined
										style={{
											width: '16vh',
											height: '20px',
											fontSize: 32,
											color: '#818282',
										}}
									/>
									Click to this area to upload
								</Col>
							</div>
						</label>
					</div>
				) : null}
			</Row>
		);
	};

	const SuccessImages = () => {
		return (
			<Row>
				{reportValue.image_success.map((item, index) => {
					return <Image style={imagePreviewSty} src={process.env.REACT_APP_API_URL + item.url} alt={'reportSuccessImg' + index} />;
				})}
				{successImg.map((item, index) => {
					return <Image style={imagePreviewSty} src={item} alt={'successImg' + index} />;
				})}
				{reportValue.image_success.length + successImg.length < 3 ? (
					<div className='inputReportImage'>
						<label htmlFor='inputSuccess'>
							<div
								class='child'
								style={{
									width: '16vh',
									height: '16vh',
									textAlign: 'center',
									fontSize: 10,
								}}
							>
								<Col>
									<PictureOutlined
										style={{
											width: '16vh',
											height: '20px',
											fontSize: 32,
											color: '#818282',
										}}
									/>
									Click to this area to upload
								</Col>
							</div>
						</label>
					</div>
				) : null}
			</Row>
		);
	};

	return (
		<Modal
			visible={visible}
			title='Manage Report'
			footer={[
				<Button
					style={{
						backgroundColor: '#D8AA81',
						color: '#F5F4EC',
					}}
					className='add-btn'
					key='add'
					onClick={closeModal}
				>
					Cancel
				</Button>,
				<Button
					style={{
						backgroundColor: '#D8AA81',
						color: '#F5F4EC',
					}}
					className='add-btn'
					key='add'
					onClick={() => {
						form.validateFields()
							.then((values) => {
								let newValues = {
									...values,
								};
								form.resetFields();
								handleEditReport(newValues);
							})
							.catch((info) => {
								console.log('Validate Failed:', info);
							});
					}}
				>
					OK
				</Button>,
			]}
			onCancel={closeModal}
			width={'70%'}
		>
			<Form
				form={form}
				layout='vertical'
				name='form_in_modal'
				initialValues={{
					modifier: 'public',
				}}
				style={{ display: 'flex' }}
			>
				<div className='report-form' style={{ flex: 1 }}>
					<Form.Item label='Owner'>
						<div className='divText'>
							<p className='disableText'>{reportValue.owner}</p>
						</div>
					</Form.Item>
					<Form.Item label='Submission Date' name='submission_date'>
						<div className='divText'>
							<p className='disableText'>{reportValue.submission_date_show}</p>
						</div>
					</Form.Item>
					<Form.Item
						name='opening_date'
						label='Opening Date'
						rules={[
							{
								required: repairReq ? false : true,
								message: 'Please select opening date',
							},
						]}
					>
						<DatePicker className='dateTime' disabled={repairReq ? true : false} />
					</Form.Item>
					<Form.Item
						name='status'
						label='Status'
						rules={[
							{
								required: true,
								message: 'Please select type',
							},
						]}
					>
						<Select style={{ width: '100%' }} onChange={statusHandle}>
							{Object.keys(status).map((type, index) => (
								<Option value={type} key={index}>
									{type}
								</Option>
							))}
						</Select>
					</Form.Item>
					<Form.Item label='Problem'>
						<div className='divText'>
							<p className='disableText'>{reportValue.problem}</p>
						</div>
					</Form.Item>
					<Form.Item label='Pending'>
						<input
							type='file'
							id='inputPending'
							accept='image/*'
							onChange={selectPendingImg}
							onClick={(event) => {
								event.target.value = null;
							}}
							style={{ display: 'none', float: 'left' }}
						/>
						<PendingImages />
					</Form.Item>
					<Form.Item label='Repairing'>
						<input
							type='file'
							id='inputRepairing'
							accept='image/*'
							onChange={selectRepairingImg}
							onClick={(event) => {
								event.target.value = null;
							}}
							style={{ display: 'none', float: 'left' }}
						/>
						<RepairingImages />
					</Form.Item>
					<Form.Item label='Success'>
						<input
							type='file'
							id='inputSuccess'
							accept='image/*'
							onChange={selectSuccessImg}
							onClick={(event) => {
								event.target.value = null;
							}}
							style={{ display: 'none', float: 'left' }}
						/>
						<SuccessImages />
					</Form.Item>
				</div>
				<div style={{ width: 45 }}></div>
				<div className='report-form' style={{ flex: 1 }}>
					<Form.Item label='Address'>
						<div className='divText'>
							<p className='disableText'>{reportValue.address_number}</p>
						</div>
					</Form.Item>
					<Form.Item
						name='pick_up_date'
						label='Receive Date'
						rules={[
							{
								required: repairReq ? false : true,
								message: 'Please select receive date',
							},
						]}
					>
						<DatePicker className='dateTime' disabled={repairReq ? true : false} />
					</Form.Item>
					<Form.Item
						name='closing_date'
						label='Closing Date'
						rules={[
							{
								required: successReq ? false : true,
								message: 'Please select closing date',
							},
						]}
					>
						<DatePicker className='dateTime' disabled={successReq ? true : false} />
					</Form.Item>
					<Form.Item label='Type'>
						<div className='divText'>
							<p className='disableText'>{reportValue.type}</p>
						</div>
					</Form.Item>
					<Form.Item label='Description'>
						<div className='divArea'>
							<p className='disableText'>{reportValue.description}</p>
						</div>
					</Form.Item>
					<Form.Item
						name='cause'
						label='Cause'
						rules={[
							{
								required: successReq ? false : true,
								message: 'Please enter cause',
							},
						]}
					>
						<Input.TextArea placeholder='Please input details' style={{ padding: '8px', borderRadius: '10px', minHeight: '20vh' }} disabled={repairReq ? true : false} />
					</Form.Item>
					<Form.Item
						name='solution'
						label='Solution'
						rules={[
							{
								required: successReq ? false : true,
								message: 'Please enter solution',
							},
						]}
					>
						<Input.TextArea placeholder='Please input details' style={{ padding: '8px', borderRadius: '10px', minHeight: '20vh' }} disabled={successReq ? true : false} />
					</Form.Item>
				</div>
			</Form>
		</Modal>
	);
}
