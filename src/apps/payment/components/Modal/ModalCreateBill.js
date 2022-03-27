import React, { useState, useEffect } from "react";
import { Form, Input, Modal, Button, Space, Select, notification } from "antd";
import {
  addressCustomer,
  postdataRescrpt,
} from "../../services/API/payment_api";
import Momnent from "moment";
import { getBillingPayment } from "../../services/thunk-action/payment_thunk";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { DatePicker } from "antd";
import { useDispatch, useSelector } from "react-redux";
import "../style/table.css";
import "../../style/payment.css";
const { RangePicker } = DatePicker;
const { Option } = Select;
const stateModalCreateBill = {
  billingInvoiceID: "AT" + new Date().getTime(),
};
const billingList = [
  { name: "Water bill", status: false, value: "Water bill" },
  { name: "Common fee", status: false, value: "Common fee" },
];

const ModalCreateBill = () => {
  const dispatch = useDispatch();
  const { status, dataCreateBilling, paramsBilling } = useSelector(
    (state) => state.PaymentActionRedux
  );

  const [dates, setDates] = useState([]);
  const [hackValue, setHackValue] = useState();
  const [value, setValue] = useState();
  const [confirmLoading, setConfirmLoading] = React.useState(false);
  const disabledDate = (current) => {
    if (!dates || dates.length === 0) {
      return false;
    }
    const tooLate = dates[0] && current.diff(dates[0], "days") > 30;
    const tooEarly = dates[1] && dates[1].diff(current, "days") > 30;
    return tooEarly || tooLate;
  };
  const [form] = Form.useForm();
  const onOpenChange = (open) => {
    if (open) {
      setHackValue([]);
      setDates([]);
    } else {
      setHackValue(undefined);
    }
    console.log(value);
  };

  useEffect(async () => {
    await form.setFieldsValue({
      Cost: dataCreateBilling?.Cost,
      totalCost: dataCreateBilling?.totalCost,
      Owner: dataCreateBilling?.fullname,
      invoice_bill: "AT" + new Date().getTime(),
    });
  }, [dataCreateBilling]);

  // set default value in from.list on select
  if (dataCreateBilling?.address) {
    form.setFieldsValue({ Address: dataCreateBilling?.address });
  }
  // set default value in from.list on select

  const onFinish = async () => {
   await setConfirmLoading(true)
    console.log("dataCreateBilling:", dataCreateBilling);
    await form
      .validateFields()
      .then(async (values) => {
        let sum = 0;
        values["users"].map((e) => {
          sum += parseFloat(e.amount);
        });
        const allValuesForm = {
          invoice_id: values["invoice_bill"],
          Address_Customer: values["Address"],
          name: values["Owner"],
          DueDateStart: values["dateTime"][0].format("YYYY-MM-DD"),
          DueDateEnd: values["dateTime"][1].format("YYYY-MM-DD"),
          subBilling: values["users"],
          totalAmount: sum,
          address_id: dataCreateBilling?.address_id,
        };
        if (dataCreateBilling?.totalCost !== null) {
          allValuesForm.totalAmount += dataCreateBilling?.totalCost;
          allValuesForm.subBilling.push({
            subBilling: dataCreateBilling?.Cost,
            amount: dataCreateBilling?.totalCost,
          });
        }

        console.log("allValuesForm:", dataCreateBilling);
        const resultPostData = await postdataRescrpt(allValuesForm);
        if (resultPostData) {
          notification["success"]({
            duration: 2,
            message: "CreateBillingPayment",
            description: "Create billing payment successfully.",
            style: { borderRadius: "25px" },
          });
          form.resetFields();
          // let paramPayment =paramsBilling
          paramsBilling.status = "Wait for payment";
          paramsBilling.defaultPage = 1;
          dispatch(getBillingPayment(paramsBilling));
          dispatch({ type: "CHANGE_COUNT", payload: 1 });
          dispatch({ type: "CREATE_BILLING", payload: null });
          dispatch({ type: "CHANGE_STATE", payload: false });
        } else {
          console.log("resultPostData:", resultPostData);
          // dispatch({
          //   type: "ENABLE_ALERT",
          //   payload: {
          //     type: "error",
          //     message: "CreateBillingPayment",
          //     description: "Create billing payment failed.",
          //   },
          // });
          notification["error"]({
            duration: 2,
            message: "CreateBillingPayment",
            description: "Create billing payment failed.",
            style: { borderRadius: "25px" },
          });
        }
        // console.log("validateFeild:", CustomerDetail);
      })
      .catch((info) => {
        // console.log("Validate Failed:", info);
      });
      await setConfirmLoading(false)
  };

  const handleCancel = async () => {
    // await setModalCreateBill((prevState) => {
    //   return {
    //     ...prevState,
    //     billingInvoiceID: "AT" + new Date().getTime(),
    //   };
    // });
    form.resetFields();
    // form.setFieldsValue({ Address: null });

    dispatch({ type: "CREATE_BILLING", payload: null });
    dispatch({ type: "CHANGE_STATE", payload: false });
  };

  return (
    <div>
      <Modal
        title={"Create Invoice Payment"}
        visible={status}
        onOk={onFinish}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        width={"30%"}
      >
        <>
          <Form
            form={form}
            name="dynamic_form_nest_item"
            // onValuesChange={changeFormValue}
            autoComplete="off"
          >
            <div className="container-fluid">
              <div className="row">
                <div className="col-sm">
                  <div>
                    <p>Invoice Bill</p>
                    <Form.Item name="invoice_bill">
                      <Input style={{ borderRadius: "25px" }} disabled={true} />
                    </Form.Item>
                  </div>

                  <div style={{ paddingTop: 10 }}>
                    <p>Address</p>
                    <Form.Item name="Address">
                      <Input style={{ borderRadius: "25px" }} disabled={true} />
                    </Form.Item>
                  </div>

                  <div
                    style={{
                      paddingTop: 10,
                      paddingBottom: 10,
                      borderRadius: "25px",
                    }}
                  >
                    <p>Name Owner</p>
                    <Form.Item
                      name="Owner"
                      rules={[
                        {
                          required: true,
                          message: "Pleases selected date range.",
                        },
                      ]}
                    >
                      <Input style={{ borderRadius: "25px" }} disabled={true} />
                    </Form.Item>
                  </div>
                </div>

                <div className="col-sm">
                  <div>
                    <p>Due Date</p>
                    <Form.Item
                      name="dateTime"
                      rules={[
                        {
                          required: true,
                          message: "Pleases selected date range.",
                        },
                      ]}
                    >
                      <RangePicker
                        value={hackValue || value}
                        disabledDate={disabledDate}
                        onCalendarChange={(val) => setDates(val)}
                        // onChange={(val) => getTime(val)}
                        onOpenChange={onOpenChange}
                      />
                    </Form.Item>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-sm">
                  <h3
                    style={{
                      paddingTop: 10,
                      paddingBottom: 10,
                      fontStyle: "bold",
                    }}
                  >
                    Payment Amount
                  </h3>
                  {dataCreateBilling?.Cost !== null ? (
                    <Space
                      style={{ display: "flex", marginBottom: 8 }}
                      align="baseline"
                    >
                      <Form.Item name={"Cost"}>
                        <Input style={{ borderRadius: "25px" }} disabled={true}></Input>
                      </Form.Item>

                      <Form.Item name={"totalCost"}>
                        <Input style={{ borderRadius: "25px" }} disabled={true}></Input>
                      </Form.Item>
                    </Space>
                  ) : null}
                  <Form.List
                    name="users"
                    rules={[
                      ({ getFieldValue }) => ({
                        validator(rule, value) {
                          console.log("value:", value);
                          if (value === undefined || value.length < 1) {
                            return Promise.reject("please add billing cost .");
                          }

                          return Promise.resolve();
                        },
                      }),
                    ]}
                  >
                    {(fields, { add, remove }, { errors }) => (
                      <>
                        {fields.map(({ key, name, fieldKey, ...restField }) => (
                          <Space
                            key={key}
                            style={{ display: "flex", marginBottom: 8 }}
                            align="baseline"
                          >
                            <Form.Item
                              {...restField}
                              name={[name, "subBilling"]}
                              // fieldKey={[fieldKey, 'subBilling']}
                              rules={[
                                {
                                  required: true,
                                  message: "Missing selection",
                                },
                              ]}
                            >
                              <Select
                                showSearch
                                style={{ width: 200 }}
                                placeholder="Select a billing"
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                  option.children
                                    .toLowerCase()
                                    .indexOf(input.toLowerCase()) >= 0
                                }
                              >
                                {billingList.map((e) => {
                                  return (
                                    <Option key={e} value={e.value}>
                                      {e.name}
                                    </Option>
                                  );
                                })}
                              </Select>
                            </Form.Item>

                            <Form.Item
                              {...restField}
                              name={[name, "amount"]}
                              // fieldKey={[fieldKey, "last"]}
                              rules={[
                                {
                                  required: true,
                                  message: "Missing amount",
                                },
                                ({ getFieldValue }) => ({
                                  validator(rule, value) {
                                    const rexp = /^[0-9]*[.0-9]+$/;
                                    if (
                                      isNaN(value) ||
                                      value === undefined ||
                                      !rexp.test(value)
                                    ) {
                                      return Promise.reject(
                                        "invalid float number"
                                      );
                                    }

                                    return Promise.resolve();
                                  },
                                }),
                              ]}
                            >
                              <Input
                                style={{ borderRadius: "25px" }}
                                placeholder="Please input amount"
                              />
                            </Form.Item>
                            <MinusCircleOutlined onClick={() => remove(name)} />
                          </Space>
                        ))}

                        <Form.Item>
                          <Button
                            style={{ borderRadius: "25px" }}
                            // style={errors !==null ?{borderColor:"#ff4d4f"}:null}
                            onClick={() => add()}
                            block
                            // icon={<PlusOutlined />}
                          >
                            Add{errors}
                            <Form.ErrorList errors={errors} />
                          </Button>
                        </Form.Item>
                      </>
                    )}
                  </Form.List>
                </div>
              </div>
            </div>
          </Form>
        </>
      </Modal>
    </div>
  );
};

export default ModalCreateBill;
