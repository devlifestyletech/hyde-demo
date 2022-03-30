import React, {useState, useEffect} from 'react';
import Heading from "../../components/Header";
import {Input, Button, Table,notification, Row, Col, Popconfirm} from "antd";
import {SearchOutlined, PlusOutlined, FormOutlined, DeleteOutlined} from "@ant-design/icons";
import {useSelector, useDispatch} from "react-redux";
import {MenuEmergency} from "./components/MenuEmergency";
// import "../../App.css";
import "./style/emengency.css";
import {deleteEMS} from "./services/API/EmergencyAPI";
import CreateEMSModal from "./components/Modal/ModalCreateEmergency";
import EditEMSModal from './components/Modal/ModalEditEmergency'
import Highlighter from "react-highlight-words";
import {getEmergency} from './services/thunk-action/Emergency_thunk'
let width = window.innerWidth;

function Emergencymain() {

    const { count, dataEMS,dataSize,loadingTable,paramsEMS } = useSelector(
        (state) => state.EMSActionRedux
    );
    const dispatch = useDispatch();
    useEffect(async () => {
        dispatch(getEmergency(paramsEmergency));
        dispatch({ type: "CHANGE_PARAMS_EMS", payload:paramsEmergency });
    }, []);

    // setting pagination Option
    const pageSizeOptions = ["5", "20", "30", "40"];
    const PaginationConfig = {
        defaultPageSize: pageSizeOptions[0],
        pageSizeOptions: pageSizeOptions,
        showSizeChanger: true,
        total: dataSize,
    };
    const paramsEmergency = {
        status:undefined,
        defaultPage: 1,
        sorter:undefined,
        filters:{
            Name:null
        },
        pagesize: PaginationConfig.defaultPageSize,
    };

    // setting pagination Option



// sreach data

const sreachData =({ currentTarget }) => {
    if (currentTarget.value.length > 0) {
        if (  paramsEMS.filters !== undefined && paramsEMS.filters !== null) {

            paramsEMS.filters={
                Name:[currentTarget.value],
                // Address_Customer:[currentTarget.value]
            }
            dispatch(getEmergency(paramsEMS));
            // console.log("paramsEMS:",paramsEMS.filters);
        }else{
            paramsEMS.filters={
                Name:[currentTarget.value],
                // Address_Customer:[currentTarget.value]
            }
        }
        //console.debug()
        // dispatch({ type: "DISPLAY_DATATABLE", payload: resultFilter });
    } else {
        paramsEMS.filters={
            Name:null,
            //   Address_Customer:null
        }
        dispatch(getEmergency(paramsEMS));
    }
}

// create ems
    const CreateEMS = async ({currentTarget}) => {
        dispatch({type:"CREATE_MODAL_EMS"});
// create ems

// delete ems
    };
    const deleteID = async (id) => {
        console.log("resultDelete:", id);
        const resultDelete = await deleteEMS(id);
        if (resultDelete) {
            notification["success"]({
                duration: 2,
                message: "DeleteEmergency",
                description: "Delete emergency by ID successfully.",
                style: {borderRadius: "25px"},
            });
        } else {
            notification["error"]({
                duration: 2,
                message: "DeleteEmergency",
                description: "Delete emergency by ID failed.",
                style: {borderRadius: "25px"},
            });
        }
    };
// delete ems

// edit ems
    const handleEdit = async ({currentTarget}) => {
        dispatch({type:"EDIT_EMS"});
        const edit_dataEMS = dataEMS.find((e)=>{

            return currentTarget.id === e.id
        })
        dispatch({type:"DATA_EDIT_EMS",payload:edit_dataEMS})
        console.log("edit",edit_dataEMS);
    };
// edit ems

    // table change

    const handleTableChange = async (pagination, filters, sorter) => {
        console.log("handleTableChange:",paramsEMS);
        // paramsEMS.status = status_billing,

        paramsEMS.defaultPage = pagination.current
        paramsEMS.pagesize =  pagination?.pageSize
        paramsEMS.filters = {
            Name: filters?.Name,
            // Address_Customer: filters?.Address_Customer,
            // Name_Customer: filters?.Name_Customer,
            // Total_BillsPayment: filters?.Total_BillsPayment,
        };

        if (sorter.order !== undefined) {

            paramsEMS.sorter={
                NameSort:sorter.columnKey,
                orderSort:sorter.order
            }
        }
        else{
            paramsEMS.sorter=sorter.order
        }

        await dispatch(getEmergency(paramsEMS));


    };
    // table change

    let columns = [
        {
            title: "No",
            dataIndex: "No",
            align:"center",
            key: "No",
            width: "5%",
        },  {
            title: "Name",
            align:"center",
            dataIndex: "Name",
            key: "Name",
            width: "10%",
        }, {
            title: "Type",
            align:"center",
            dataIndex: "Type",
            key: "Type",
            width: "10%",

        },
        {
            title: "Tel",
            align:"center",
            dataIndex: "Tel",
            key: "Tel",
            width: "10%",
        },{
            title: "Location",
            align:"center",
            dataIndex: "location",
            key: "location",
            width: "15%",
        },
        {
            title: 'Action',
            align:"center",
            key: 'operation',
            width: "5%",
            render: (text, record) => (
                <>
                    <Row justify="space-between">
                        <Col>
                            <icon
                                icon={<FormOutlined/>}
                                title="Sure to Edit?"
                                id={record.id}
                                onClick={handleEdit}
                                // onConfirm={() => handleEdit(record)}
                            >
                                <FormOutlined style={{fontSize: 18, color: "#1D1C1C"}}/>
                            </icon>
                        </Col>
                        <Col>
                            {/*<img src="/main/icons/sep.png" alt="Separate" />*/}
                        </Col>
                        <Col>
                            <Popconfirm
                                icon={<DeleteOutlined />}
                                title="Sure to delete?"
                                onConfirm={() => deleteID(record.id)}
                            >
                                <DeleteOutlined style={{ fontSize: 18, color: "#1D1C1C" }} />
                            </Popconfirm>
                            {/* <button
                                icon={<DeleteOutlined/>}
                                title="Sure to delete?"
                                onClick={deleteBillingByID(record.id)}
                            >
                                <DeleteOutlined style={{fontSize: 18, color: "#1D1C1C"}}/>
                            </button> */}
                        </Col>
                    </Row>
                    {/*<Button*/}
                    {/*    danger*/}
                    {/*    value={record.id}*/}
                    {/*    type="Default"*/}
                    {/*    shape="round"*/}
                    {/*    icon={<DeleteFilled style={{verticalAlign: "baseline"}}/>}*/}

                    {/*>*/}
                    {/*    delete*/}
                    {/*</Button>*/}
                </>
            ),
        }

    ];

    return (
        <>
            {/*<ModalEdit/>*/}
            <Heading title="Emergency Contact List"/>
            <div className='row' style={{paddingTop: 35, paddingBottom: 20}}>
                <div className='col-8'>
                    <div className='flex-container'>
                        <div style={{flex: 1, display: 'flex', justifyContent: 'flex-end',}}>
                            {/*{status_billing === "Bill not generated" ?*/}
                            <Button
                                style={{
                                    display: 'flex',
                                    padding: 10,
                                    paddingRight: 10,
                                    width: width * 0.1,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                                icon={<PlusOutlined/>}
                                className='buttom_payment1'
                                type="Default" shape="round"
                                onClick={CreateEMS}
                            > Create Contact
                            </Button>
                        </div>
                    </div>
                    <div className='building_custom'>
                        <Input placeholder={`Search by name`} onChange={sreachData} prefix={<SearchOutlined/>}/>
                    </div>
                </div>
            </div>
            <MenuEmergency/>
            <Table
                loading={loadingTable}
                pagination={PaginationConfig}
                columns={columns}
                onChange={handleTableChange}
                dataSource={dataEMS}
            />
            <CreateEMSModal/>
            <EditEMSModal/>
        </>

    );
};

export default Emergencymain;
