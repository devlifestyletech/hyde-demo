import React, {useState, useEffect} from 'react';
import {
    Button,
    notification,
    Input,
    Table,
    Menu,
    Select,
    Row,
    Col,
    Popconfirm, Badge, Dropdown, Space
} from "antd";
import {
    DeleteOutlined,
    DownOutlined, EditOutlined,
    PlusOutlined,
    SearchOutlined,
    FormOutlined,
} from "@ant-design/icons";
import Heading from "../../components/Header";
import {useSelector, useDispatch} from "react-redux";
import CreateWarrantyModal from './components/modal/ModalCreateWarranty'
import EditWarrantyModal from './components/modal/ModalEditWarranty'
import {deleteWarranty} from './API/warranty_API'
import {getWarrantyProjectStore} from './services/thunk-action/Warranty_thunk'
import warrantyImage from "../../components/assets/warranty.svg";
function WarrantyMain() {
// const [DataWarranty, setDataWarranty] = useState(null)
const [UserWarranty, setUserWarranty] = useState(null)
const [WarrantyEdit, setWarrantyEdit] = useState(null)
const {dataWarranty,dataSizeWarranty,loadingTableWarranty,paramsWarranty } = useSelector(
    (state) => state.WarrantyActionRedux
);
const dispatch = useDispatch();
    // setting pagination Option
    const pageSizeOptions = ["10", "20", "30", "40"];
    const PaginationConfig = {
        defaultPageSize: pageSizeOptions[0],
        pageSizeOptions: pageSizeOptions,
        showSizeChanger: true,
        total: dataSizeWarranty,
    };
const paramsWarrantyProject={defaultPage: 1,
    sorter:undefined,
    filters:{
        subject:null,
    },
    pagesize: PaginationConfig.defaultPageSize,}
    useEffect(async() => {
        dispatch({ type: "CHANGE_PARAMS_WARRANTY", payload: paramsWarrantyProject });
        dispatch(getWarrantyProjectStore(paramsWarrantyProject))
        
    }, []);
// create createbuilding by Id
    const createWarranty = async ({currentTarget}) => {
        const [dataByid] = dataWarranty?.dataTop.filter((e)=>{return e.address_number==currentTarget.value})
        console.log("createWarranty:", dataWarranty?.dataTop,);
        let data={
            owner:dataByid.owner,
            address:{
                "_id": dataByid.id,
            "address_number": dataByid.address_number,
            "room_no": dataByid.room_no,
            "floor": dataByid.floor,
            "published_at": dataByid.published_at,
            "createdAt": dataByid.createdAt,
            "updatedAt": dataByid.updatedAt,
            "__v": 0,
            "building_zone": dataByid.building_zone,
            "project":dataByid.project,
            "owner": dataByid.owner,
            "id": dataByid.id
        }
    }
    // console.log("createWarranty:",data)
    await setUserWarranty(data)
    
        dispatch({type: "CREATE_MODAL_Warranty"});
    };
    // create createbuilding by Id

    //delete deleteWarranty by id
    const deleteID = async (id) => {
        // console.log("resultDelete:", id);
        const resultDelete = await deleteWarranty(id);
        if (resultDelete) {
            notification["success"]({
                duration: 2,
                message: "Delete Warranty",
                description: "Delete warranty by ID successfully.",
                style: {borderRadius: "25px"},
            });
            dispatch(getWarrantyProjectStore(paramsWarranty))
        } else {
            notification["error"]({
                duration: 2,
                message: "Delete Warranty",
                description: "Delete warranty by ID failed.",
                style: {borderRadius: "25px"},
            });
        }
    };
    //delete deleteWarranty by id

 
  // table change

  const handleTableChange = async (pagination, filters, sorter) => {

      paramsWarranty.defaultPage = pagination.current
      paramsWarranty.pagesize = pagination.pageSize


    if (sorter.order !== undefined) {
        paramsWarranty.sorter = {
        NameSort: sorter.columnKey,
        orderSort: sorter.order,
      };
    } else {
        paramsWarranty.sorter = sorter.order;
    }
   
      dispatch(getWarrantyProjectStore(paramsWarranty));

  };
  // table change




    // // editWarranty
    const editWarranty = async ({currentTarget}) => {
        let condiArray={
            id:currentTarget.id.slice(0,currentTarget.id.length-1),
            index:currentTarget.id.substr(currentTarget.id.length-1)
        }
        const [dataByid] = dataWarranty?.dataChild[condiArray.index].filter((e)=>{
            return e.id===condiArray.id
        })
    //   console.log("editWarranty:",dataByid)
    await setWarrantyEdit(dataByid)
    dispatch({type:"EDIT_WARRANTY"});
  
    };
    // editWarranty

// expandedRowRender list
    const expandedRowRender = (param,expanded) => {
        let data = dataWarranty?.dataChild[param.key]
        let count =0
        const columns = [
            {
                title: 'productImage', dataIndex: 'imageUrl', key: 'imageUrl', render: (text, record) => {
                    return (
                        <div>
                             <img width={120} height={120}
                                 src={record.imageUrl!== undefined ?record.imageUrl:warrantyImage}/>
                        </div>
                    );
                },
            },
            {title: 'Warranty Name', dataIndex: 'device_name', key: 'device_name'},
            {title: 'Serial Number', dataIndex: 'serial_number', key: 'serial_number'},
            {title: 'Purchase Date', dataIndex: 'purchase_date', key: 'purchase_date'},
            {title: 'Expire Date', dataIndex: 'expire_date', key: 'expire_date'},
            {
                title: 'Action',
                key: 'operation',
                render: (text, record) => (
                    <>
                        <Row justify="space-between">
                            <Col>
                                <icon
                                    icon={<FormOutlined/>}
                                    title="Sure to Edit?"
                                    id={record.id+param.key}
                                    onClick={editWarranty}
                                    // onConfirm={() => editWarranty(record)}
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
    
                            </Col>
                        </Row>
    
                    </>
    
                ),
            }
        ];

      
        count =count+1
        return <Table columns={columns} dataSource={data} pagination={false}/>;
    };
// expandedRowRender list

// table warranty
    const columns = [
        {title: 'No', dataIndex: 'No', key: 'No',},
        {
            title: 'Address', 
            dataIndex: 'address_number', 
            key: 'address_number', 
            sorter: (a, b) =>a.address_number.localeCompare(b.address_number)
        },
        {title: 'Owner', 
        dataIndex: 'ownerName', 
        key: 'ownerName',
        sorter: (a, b) =>a.ownerName.localeCompare(b.ownerName)
    },
        {title: 'Nationality', 
        dataIndex: 'Nationality', 
        key: 'Nationality',
        sorter: (a, b) =>a.Nationality.localeCompare(b.Nationality)
    },
        {title: 'Tel.', 
        dataIndex: 'Tel', 
        key: 'Tel',
        sorter: (a, b) =>a.Tel.localeCompare(b.Tel)
    },
        {title: 'Email', 
        dataIndex: 'email', 
        key: 'email',
        sorter: (a, b) =>a.email.localeCompare(b.email)
    },
        {title: 'Action', key: 'Action', render: (record) =>

                    <Button
                         value={record.address_number}
                        type="Default"
                        className="buttom_create"
                        shape="round"
                         onClick={createWarranty}
                    >
                        Add Warranty
                    </Button>
               },
    ];
// table warranty

const serachWarranty = async({ currentTarget }) => {
    if (currentTarget.value.length > 0) {
        if (paramsWarranty.filters !== undefined &&paramsWarranty.filters !== null) {
            paramsWarranty.filters = {
                address_number: currentTarget.value,
            };
        } else {
            paramsWarranty.filters = {
                address_number: currentTarget.value,
            };
        }
        
    } else {
        paramsWarranty.filters = {
            address_number: null,
        };
        
    }
    dispatch(getWarrantyProjectStore(paramsWarranty));
}
    return (
        <>
            <Heading title="Warranty Lists"/>
            <div className='row' style={{paddingTop: 35, paddingBottom: 20}}>
                <div className='building_custom'>
                    <Input placeholder={`Search by Address`} onChange={(e) => {
                        serachWarranty(e)
                    } } prefix={<SearchOutlined/>}/>
                </div>

                <div className='col-8'>
                    <div className='flex-container'>
                        <div style={{flex: 1, display: 'flex', justifyContent: 'flex-end',}}>
                         
                        </div>
                    </div>
                </div>

            </div>
            <Table
                className="components-table-demo-nested"
                columns={columns}
                expandable={{expandedRowRender}}
                loading={loadingTableWarranty}
                pagination={PaginationConfig}
                onChange={handleTableChange}
                dataSource={dataWarranty?.dataTop}
            />
<CreateWarrantyModal UserWarranty={UserWarranty ?UserWarranty:null}/>
<EditWarrantyModal dataWarrantyEdit={WarrantyEdit ?WarrantyEdit:null}/>
        </>
    );
}

export default WarrantyMain;
