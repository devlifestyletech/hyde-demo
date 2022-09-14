import React from "react";
import { Input, Modal, notification, Button, Radio, Col, Row } from "antd";

import bill from "../../assets/images/bill.jpg";
import { bankNamecode } from "../../services/bankNameCode";
import { updateRescrpt, rejectRescrpt } from "../../services/API/PaymentAPI";
import { getBillingPayment } from "../../services/thunk-action/payment_thunk";
import { useDispatch, useSelector } from "react-redux";

import moment from "moment";

const ModalPendingBill = () => {
  const {
    statusModalPending,
    dataBillingAllApprove,
    countFCM,
    paramsBilling,
  } = useSelector((state) => state.PaymentActionRedux);
  const dispatch = useDispatch();
  // handleOK
  let countTotal=countFCM-1
  const handleOk = async () => {
    // dispatch({ type: "CHANGE_FCM_COUNT", payload: countTotal });
    const result = dataBillingAllApprove;
    console.log("resultUPdate:", result);
    const status = await updateRescrpt(result[0]);
    if (status) {
      notification["success"]({
        duration: 2,
        message: "ApproveBillingPayment",
        description: "Approve billing payment successful.",
        style: { borderRadius: "25px" },
      });
      dispatch({ type: "CHANGE_COUNT", payload: 3 });
      paramsBilling.status = "Payment successful";
      dispatch(getBillingPayment(paramsBilling));
      dispatch({ type: "MODAL_PENDING", payload: false });
    } else {
      notification["error"]({
        duration: 2,
        message: "ApproveBillingPayment",
        description: "Approve billing payment failed.",
        style: { borderRadius: "25px" },
      });
    }
  };
  const rejectCommentaData = ["Invalid uploaded image, Please try again.", "Bill payment slip not match the uploaded image , Please try again."]

  const [value, setValue] = React.useState(null);
  const [visible, setvisible] = React.useState(false);
  // visible
  const [commentText, setcommentText] = React.useState(null);
  const onChange = async e => {
    if (e.target.value === "อื่นๆ") {
      await setValue(commentText)
    }
    // console.log('radio checked', e.target.value);
    setValue(e.target.value);
  };
  const handleCancel = () => {
    // dispatch({ type: "CHANGE_FCM_COUNT", payload: countTotal });
    dispatch({ type: "MODAL_PENDING", payload: false });
  };

  const rejcetPayment = async () => { 
    await setvisible(!visible)
  };
const textChange = async({currentTarget}) => {
 
await setcommentText(currentTarget.value)
  
}

  const rejceCancel =  async() => { 
    await setcommentText(null)
    await setValue(null)
    await setvisible(!visible) 
  
  }
  const rejcetOK =async ()=> {
    // dispatch({ type: "CHANGE_FCM_COUNT", payload: countTotal });
      const result = dataBillingAllApprove;
    const status = await rejectRescrpt(result[0],value);
    if (status) {
      notification["warning"]({
        duration: 2,
        message: "RejectBillingPayment",
        description: "Reject billing payment successful.",
        style: { borderRadius: "25px" },
      });
      setvisible(!visible)
      dispatch({ type: "CHANGE_COUNT", payload: 4 });
      paramsBilling.status = "Payment annotation";
      dispatch(getBillingPayment(paramsBilling));
      dispatch({ type: "MODAL_PENDING", payload: false });
    } else {
      notification["error"]({
        duration: 2,
        message: "RejectBillingPayment",
        description: "Reject billing payment failed.",
        style: { borderRadius: "25px" },
      });
    }
    }
  return (
    <div>
      <Modal
        title={"Payment Review"}
        visible={statusModalPending}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={rejcetPayment}>
            Reject
          </Button>,
          <Button
            key="submit"
            type="primary"
            // loading={loading}
            onClick={handleOk}
          >
            Approve
          </Button>,
        ]}
        width='900px'
      >
        {dataBillingAllApprove !== null
          ? dataBillingAllApprove.map((e, i) => {
            return (
              <>
                <div key={i} className="container-fluid">
                  <div className="row">
                    <div className="col-sm"></div>
                    <Row>
                      <Col span={12}>
                        <div>
                          <p>Invoice Bill</p>
                          <Input
                          style={{ borderRadius: "25px" }}
                            placeholder="No data form SCB"
                            disabled={true}
                            value={e?.BillsPayment_Invoice}
                          />
                        </div>
                        <div style={{ paddingTop: 10 }}>
                          <p>Address</p>
                          <Input
                          style={{ borderRadius: "25px" }}
                            placeholder="No data form SCB"
                            disabled={true}
                            value={e?.Address_Customer}
                          />
                        </div>

                        <div style={{ paddingTop: 10 }}>
                          <p>Name Owner</p>
                          <Input
                          style={{ borderRadius: "25px" }}
                            placeholder="No data form SCB"
                            disabled={true}
                            value={e?.Name_Customer}
                          />
                        </div>

                        <div style={{ paddingTop: 10 }}>
                          <p>Payment Date</p>
                          <Input
                          style={{ borderRadius: "25px" }}
                            placeholder="No data form SCB"
                            disabled={true}
                            value={moment(e?.transactionDateandTime).format(
                              "DD/MM/YYYY HH:mm:ss"
                            )}
                          />
                        </div>

                        <div style={{ paddingTop: 20 }}>
                          <h3>Payment Amount</h3>
                        </div>

                        {e?.BillsPayment_AllType
                          ? e?.BillsPayment_AllType.map((e) => {
                            return (
                              <>
                                <div style={{ paddingTop: 10}}>
                                  <Row>
                                    <Col span={12}>
                                      <div style={{ marginRight: 10 }}>
                                        <Input
                                        style={{ borderRadius: "25px" }}
                                          placeholder="No data form SCB"
                                          disabled={true}
                                          value={e?.subBilling}
                                        />
                                      </div>
                                    </Col>
                                    <Col span={12}>
                                      <div >
                                        <Input
                                        style={{ borderRadius: "25px" }}
                                          placeholder="No data form SCB"
                                          disabled={true}
                                          value={e?.amount}
                                        />
                                      </div>
                                    </Col>
                                  </Row></div>

                              </>
                            );
                          })
                          : null}
                        <div style={{ paddingTop: 20 }}>
                          <h3>Payment Transaction</h3>
                        </div>

                        {e?.payeeProxyId !== undefined ? (
                          <div className="row">
                            <div className="col-sm">
                              <div style={{ paddingTop: 10 }}>
                                <p>Biller ID</p>
                                <Input
                                style={{ borderRadius: "25px" }}
                                  placeholder="No data form SCB"
                                  disabled={true}
                                  value={e?.payeeProxyId}
                                />
                              </div>
                              <div style={{ paddingTop: 10 }}>
                                <p>PayerName</p>
                                <Input
                                style={{ borderRadius: "25px" }}
                                  placeholder="No data form SCB"
                                  disabled={true}
                                  value={e?.payerName}
                                />
                              </div>

                              <div style={{ paddingTop: 10 }}>
                                <p>Bank transfer</p>
                                <Input
                                style={{ borderRadius: "25px" }}
                                  placeholder="No data form SCB"
                                  disabled={true}
                                  value={bankNamecode(e?.sendingBankCode)}
                                />
                              </div>
                              <div style={{ paddingTop: 10 }}>
                                <p>Account number</p>
                                <Input
                                style={{ borderRadius: "25px" }}
                                  placeholder="No data form SCB"
                                  disabled={true}
                                  value={e?.payerAccountNumber}
                                />
                              </div>
                              <div style={{ paddingTop: 10 }}>
                                <p>Total Amount</p>
                                <Input
                                style={{ borderRadius: "25px" }}
                                  placeholder="No data form SCB"
                                  disabled={true}
                                  value={e?.amount}
                                />
                              </div>
                            </div>

                          </div>
                        ) : (
                          <h1>No data transaction</h1>
                        )}
                      </Col>

                      <Col span={12}>
                        <div className="col-sm">
                          <div className="container-fluid">
                            <img
                              src={e.imageURL !== null ? e.imageURL : bill}
                              style={{ width: '300px', height:'500px' ,marginLeft: '70px' ,marginTop:'140px'}}
                            />
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </div>
                </div>
              </>
            );
          })
          : null}
      </Modal>
      <Modal
          title="Annotation"
          visible={visible}
          onOk={rejcetOK}
          okButtonProps= {{disabled: value === null ? true:false}}
          onCancel={rejceCancel}
          okText="ok"
          cancelText="cancel"
        >
           <div>
            {/* <p>annotaion</p> */}
            <Radio.Group onChange={onChange} value={value}>
              {rejectCommentaData.map((e,i) => {
                return <Radio key={i} value={e}>{e}</Radio>
              })}
            </Radio.Group>
            {value === "other" ? <Input onChange={textChange} placeholder="annotaion more" /> : null}
          </div>
        </Modal>
    </div>
  );
};

export default ModalPendingBill;
