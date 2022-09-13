import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Modal, Row, Col } from 'antd';
import Pdf from 'react-to-pdf';
import logo from '../../assets/images/hyde-logo.svg';
const ref = React.createRef();
const ModalExportBilling = () => {
  const { statusExportBilling, dataBillingAllExport } = useSelector(
    (state) => state.PaymentActionRedux
  );
  const dispatch = useDispatch();
  const handleCancel = async () => {
    dispatch({ type: 'CHANGE_STATE_EXPORT_BILLING', payload: false });
  };
  return (
    <div>
      <Pdf targetRef={ref} filename="Artani_Bills.pdf">
        {({ toPdf }) => (
          <div>
            <Modal
              title="Payment Receipt"
              visible={statusExportBilling}
              width='800px'
              height='900px'
              onOk={toPdf}
              okText="Create"
              okType="default"
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
                  marginRight: '600px',
                  background: '#B8B7B2',
                  color: '#F5F4EC',
                },
              }}
              onCancel={handleCancel}
              cancelText="Back"
            >
              {dataBillingAllExport !== null
                ? dataBillingAllExport.map((e) => {
                    return (
                      <>
                        <div className="container-fluid" ref={ref}>
                        <Row>
                          <Col span={12}>
                            <div
                              className="col-4"
                              style={{ textAlign: 'left' }}
                            >
                              <img
                                src={logo}
                                style={{
                                  marginLeft:'100px',
                                  width: '241px',
                                  height:'90px',
                                  marginTop: '4%',
                                  marginLeft: '15%',
                                  paddingBottom: '5%',
                                }}
                              />
                            </div>
                          </Col>
                          <Col span={12}>
                            <div
                              className="col-8"
                              style={{ textAlign: 'right' }}
                            >
                              <h3 style={{ fontStyle: 'bold' }}>
                                <span>
                                  Hyde Heritage at Thonglor Condominium
                                </span>
                              </h3>
                              <h3 style={{ fontStyle: 'bold' }}>
                                <span>Juristic Person1199 Sukhumvit Rd.</span>
                              </h3>
                              <h3 style={{ fontStyle: 'bold' }}>
                                <span>
                                  Klongton Nua, Wattana, Bangkok, 10110
                                </span>
                              </h3>
                              <h3 style={{ fontStyle: 'bold' }}>
                                <span>Tel. 0987635822</span>
                              </h3>
                            </div>
                          </Col>
                        </Row>

                        <Row style={{ paddingBottom: '2vh' }}>
                          <Col
                            span={12}
                            style={{
                              textAlign: 'left',
                              paddingLeft: '',
                            }}
                          >
                            <span>
                              Invoice Bill: {e?.BillsPayment_Invoice}
                              <br />
                              Tax number: 0012254
                              <br />
                              Name Owner: {e?.Name_Customer}
                              <br />
                              Address: {e?.Address_Customer}
                              <br />
                            </span>
                          </Col>
                          <Col
                            span={12}
                            style={{
                              textAlign: 'left',
                              paddingLeft: '70px',
                            }}
                          >
                            <span>
                              Due Date
                              <br />
                              From : {e?.BillsPayment_Date_Start}
                              <br />
                              To : {e?.BillsPayment_Date_End}
                              <br />
                              {/* Issued by: Admin2*/}
                              Create on : {e?.BillsPayment_Date_Start}
                              <br />
                            </span>
                          </Col>
                        </Row>

                        <div className="container-fluid">
                          <table>
                            <tr>
                              <th
                                style={{
                                  backgroundColor: '#B8B8B8',
                                  color: '#000000',
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
                                  color: '#000000',
                                  width: '30%',
                                  textAlign: 'center',
                                }}
                              >
                                Detail
                              </th>
                              <th
                                style={{
                                  backgroundColor: '#B8B8B8',
                                  color: '#000000',
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
                                    <tr
                                      style={{
                                        textAlign: 'center',
                                        backgroundColor: '#E2E1E1',
                                        borderBottomWidth: 10,
                                        borderColor: '#000000',
                                      }}
                                    >
                                      <td
                                        style={{
                                          borderBottomWidth: 1,
                                          borderColor: '#B8B8B8',
                                        }}
                                      >
                                        {j + 1}
                                      </td>
                                      <td
                                        style={{
                                          borderBottomWidth: 1,
                                          borderColor: '#B8B8B8',
                                        }}
                                      >
                                        {f.subBilling}
                                      </td>
                                      <td
                                        style={{
                                          borderBottomWidth: 1,
                                          borderColor: '#B8B8B8',
                                        }}
                                      >
                                        {f.amount}
                                      </td>
                                    </tr>
                                  );
                                })
                              : null}
                          </table>
                        </div>
                        <div className="container-fluid">
                          <div
                            className="row"
                            style={{
                              paddingTop: '15%',
                              backgroundColor: '#E2E1E1',
                            }}
                          >
                            <Row>
                              <Col span={8} style={{ textAlign: 'left' }}>
                                {' '}
                              </Col>
                              <Col
                                span={8}
                                style={{
                                  textAlign: 'left',
                                  paddingLeft: '10%',
                                }}
                              >
                                Sub Total:
                                <br />
                                Vat:
                                <br />
                                <span
                                  style={{ WebkitTextStroke: '0.5px black' }}
                                >
                                  Grand Total:
                                  <br />
                                </span>
                              </Col>
                              <Col span={4} style={{textAlign: 'left' }}>
                                {e?.Total_BillsPayment}
                                <br />
                                0.00 <br />
                                <span
                                  style={{ WebkitTextStroke: '0.5px black' }}
                                >
                                  {e?.Total_BillsPayment}
                                  <br />
                                </span>
                              </Col>
                              <Col span={2} style={{ textAlign: 'left' }}>
                                {' '}
                                THB.
                                <br />
                                THB.
                                <br />
                                <span
                                  style={{ WebkitTextStroke: '0.5px black' }}
                                >
                                  {' '}
                                  THB.
                                  <br />
                                </span>
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
