import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Modal, Row, Col } from 'antd';
import Pdf from 'react-to-pdf';
import logo from '../../assets/images/hyde-logo.svg';
const ref = React.createRef();
const ModalExportBilling = () => {
	const { statusExportBilling, dataBillingAllExport } = useSelector((state) => state.PaymentActionRedux);
	const dispatch = useDispatch();
	const handleCancel = async () => {
		dispatch({ type: 'CHANGE_STATE_EXPORT_BILLING', payload: false });
	};
	return (
		<div>
			<Pdf targetRef={ref} filename='Hyde_Heritage_Bills.pdf'>
				{({ toPdf }) => (
					<div>
						<Modal
							title='Payment Receipt'
							visible={statusExportBilling}
							width={'45%'}
							onOk={toPdf}
							okText='Create'
							okType='default'
							okButtonProps={{
								style: {
									width: 80,
									height: 35,
									borderRadius: '15px',
									background: '#B2A37A',
									color: '#F5F4EC',
								},
							}}
							cancelButtonProps={{
								style: {
									width: 80,
									height: 35,
									borderRadius: '15px',
									marginRight: '34.5vw',
									background: '#B8B7B2',
									color: '#F5F4EC',
								},
							}}
							onCancel={handleCancel}
							cancelText='Back'
						>
							{dataBillingAllExport !== null
								? dataBillingAllExport.map((e) => {
										return (
											<>
												<div className='container-fluid' ref={ref}>
													<Row>
														<Col span={12}>
															<div className='col-4' style={{ textAlign: 'left' }}>
																<img
																	src={logo}
																	style={{
																		width: '10vw',
																		marginTop: '6%',
																		marginLeft: '10%',
																	}}
																	alt='logo'
																/>
															</div>
														</Col>
														<Col span={12}>
															<div className='col-8' style={{ textAlign: 'left' }}>
																<h3 style={{ margin: '4%' }}>
																	Hyde Heritage at Thonglor Condominium Juristic Person 1199 Sukhumvit Rd., Klongton Nua, Wattana, Bangkok, 10110 Tel. 0987645822
																</h3>
															</div>
														</Col>
													</Row>

													<Row style={{ paddingBottom: '2vh' }}>
														<Col
															span={12}
															style={{
																textAlign: 'left',
																paddingLeft: '5%',
															}}
														>
															<text>
																Invoice Bill: {e?.BillsPayment_Invoice}
																<br />
																Tax number: 0012254
																<br />
																Name Owner: {e?.Name_Customer}
																<br />
																Address: {e?.Address_Customer}
																<br />
															</text>
														</Col>
														<Col
															span={12}
															style={{
																textAlign: 'left',
																paddingLeft: '2%',
															}}
														>
															<text>
																Due Date
																<br />
																From : {e?.BillsPayment_Date_Start}
																<br />
																To : {e?.BillsPayment_Date_End}
																<br />
																{/* Issued by: Admin2*/}
																Create on : {e?.BillsPayment_Date_Start}
																<br />
															</text>
														</Col>
													</Row>

													<div className='container-fluid'>
														<table>
															<tr>
																<th
																	style={{
																		backgroundColor: '#B8B8B8',
																		// borderTopLeftRadius: "10px",
																		width: '30%',
																		textAlign: 'center',
																	}}
																>
																	No.
																</th>
																<th
																	style={{
																		backgroundColor: '#B8B8B8',
																		width: '30%',
																		textAlign: 'center',
																	}}
																>
																	Detail
																</th>
																<th
																	style={{
																		backgroundColor: '#B8B8B8',
																		// borderTopRightRadius: "10px",
																		width: '30%',
																		textAlign: 'center',
																	}}
																>
																	Amount
																</th>
															</tr>
															{e?.BillsPayment_AllType
																? e?.BillsPayment_AllType?.map((f, j) => {
																		return (
																			<tr style={{ textAlign: 'center', backgroundColor: '#E2E1E1' }}>
																				<td>{j + 1}</td>
																				<td>{f.subBilling}</td>
																				<td>{f.amount}</td>
																			</tr>
																		);
																  })
																: null}
															{/* <tr style={{ textAlign: "center" }}>
                                  <td>1</td>
                                  <td>
                                    {e?.BillsPayment_AllType[0].subBilling}
                                  </td>
                                  <td>{e?.BillsPayment_AllType[0].amount}</td>
                                </tr>
                                <tr>
                                  <td>2</td>
                                  <td>
                                    {e?.BillsPayment_AllType[1].subBilling}
                                  </td>
                                  <td>{e?.BillsPayment_AllType[1].amount}</td>
                                </tr> */}
														</table>
													</div>

													<div className='container-fluid'>
														<div className='row' style={{ paddingTop: '2vh', backgroundColor: '#E2E1E1' }}>
															<Row>
																<Col span={8} style={{ textAlign: 'left' }}>
																	{' '}
																</Col>
																<Col span={8} style={{ textAlign: 'left', paddingLeft: '10%' }}>
																	Sub Total:
																	<br />
																	Vat:
																	<br />
																	<h3>
																		Grand Total:
																		<br />
																	</h3>
																</Col>
																<Col span={4} style={{ textAlign: 'left' }}>
																	{e?.Total_BillsPayment}
																	<br />
																	0 <br />
																	<h3>
																		{e?.Total_BillsPayment}
																		<br />
																	</h3>
																</Col>
																<Col span={2} style={{ textAlign: 'left' }}>
																	{' '}
																	THB.
																	<br />
																	THB.
																	<br />
																	<h3>
																		{' '}
																		THB.
																		<br />
																	</h3>
																</Col>
															</Row>
														</div>
													</div>
												</div>
											</>
										);
								  })
								: null}
						</Modal>
					</div>
				)}
			</Pdf>
		</div>
	);
};

export default ModalExportBilling;
