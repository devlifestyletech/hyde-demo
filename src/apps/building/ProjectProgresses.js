import React, { useState, useEffect } from "react";
import { Button, notification, Input, Table, Row, Col, Popconfirm } from "antd";
import {
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
  FormOutlined,
} from "@ant-design/icons";
import Heading from "../../components/Header";
import Highlighter from "react-highlight-words";
import "./style/building.css";
import { DataBuildingStore } from "./services/thunk-action/building_thunk";
import { useSelector, useDispatch } from "react-redux";
import { deleteBuilding } from "../building/services/API/building_API";
import CreateBuildModal from "./components/Modal/ModalCreatebuilding";
import ModalEdit from "./components/Modal/ModalEdit";
import bill from "../../components/assets/announcement.svg";
let width = window.innerWidth;
let height = window.innerHeight;

function ProjectProgresses() {
  const { dataBuilding, loadingBuilding, dataSize, paramsBuildingProgress } =
    useSelector((state) => state.BuildProgressActionRedux);
  const dispatch = useDispatch();

  // setting pagination Option
  const pageSizeOptions = ["10", "20", "30", "40"];
  const PaginationConfig = {
    defaultPageSize: pageSizeOptions[0],
    pageSizeOptions: pageSizeOptions,
    showSizeChanger: true,
    total: dataSize,
  };
  const paramsBuilding = {
    defaultPage: 1,
    sorter: undefined,
    filters: {
      subject: null,
    },
    pagesize: PaginationConfig.defaultPageSize,
  };
  useEffect(() => {
    dispatch({ type: "CHANGE_PARAMS_BUILD", payload: paramsBuilding });
    dispatch(DataBuildingStore(paramsBuilding));
  }, []);
  // create createbuilding by Id
  const createbuilding = async ({ currentTarget }) => {
    //    console.log("createBuilding:",dataBuilding?.dataTop);
    await dispatch({
      type: "EDIT_BUILDINGPROGRESS",
      payload: dataBuilding?.dataTop[0],
    });
    dispatch({ type: "CHANGE_STATE_BUILDING", payload: true });
  };
  // create createbuilding by Id

  //delete billingPayment
  const deleteID = async (id) => {
    // console.log("resultDelete:", id);
    const resultDelete = await deleteBuilding(id);
    if (resultDelete) {
      notification["success"]({
        duration: 2,
        message: "DeleteBillingPayment",
        description: "Delete billing payment by ID successfully.",
        style: { borderRadius: "25px" },
      });
      dispatch(DataBuildingStore(paramsBuilding));
    } else {
      notification["error"]({
        duration: 2,
        message: "DeleteBillingPayment",
        description: "Delete billing payment by ID failed.",
        style: { borderRadius: "25px" },
      });
    }
  };
  //delete billingPayment

  const sreachData = ({ currentTarget }) => {
    if (currentTarget.value.length > 0) {
      if (
        paramsBuildingProgress.filters !== undefined &&
        paramsBuildingProgress.filters !== null
      ) {
        paramsBuildingProgress.filters = {
          subject: [currentTarget.value],
          // Address_Customer:[currentTarget.value]
        };
        dispatch(DataBuildingStore(paramsBuildingProgress));
        // console.log("paramsBuildingProgress:",paramsBuildingProgress.filters);
      } else {
        paramsBuildingProgress.filters = {
          subject: [currentTarget.value],
          // Address_Customer:[currentTarget.value]
        };
      }
      //console.debug()
      // dispatch({ type: "DISPLAY_DATATABLE", payload: resultFilter });
    } else {
      paramsBuildingProgress.filters = {
        subject: null,
        //   Address_Customer:null
      };
      dispatch(DataBuildingStore(paramsBuildingProgress));
    }
  };

  // handleEdit
  const handleEdit = async ({ currentTarget }) => {
    // const result =dataBuilding.dataTop
    const edit_dataBuilding = dataBuilding.dataTop.find((e) => {
      // if (Array.isArray(e.imageprogress)) {
      //     e.imageprogress.map((f,k)=>{
      //         f.uid=`-${k}`
      //         f.url="http://ec2-18-136-103-205.ap-southeast-1.compute.amazonaws.com:1337"+f.url
      //     })
      // }
      return currentTarget.id === e.id;
    });
    await dispatch({
      type: "EDIT_BUILDINGPROGRESS",
      payload: edit_dataBuilding,
    });
    await dispatch({ type: "MODAL_EDIT" });
  };
  // table change

  const handleTableChange = (pagination, filters, sorter) => {
    // eslint-disable-next-line no-unused-expressions
    (paramsBuildingProgress.defaultPage = pagination.current),
      (paramsBuildingProgress.pagesize = pagination.pageSize);
    // paramsBuildingProgress.filters = {
    //   BillsPayment_Invoice: filters?.BillsPayment_Invoice,
    //   Address_Customer: filters?.Address_Customer,
    //   Name_Customer: filters?.Name_Customer,
    //   Total_BillsPayment: filters?.Total_BillsPayment,
    // };

    if (sorter.order !== undefined) {
      paramsBuildingProgress.sorter = {
        NameSort: sorter.columnKey,
        orderSort: sorter.order,
      };
    } else {
      paramsBuildingProgress.sorter = sorter.order;
    }
    // if (status_billing === "Bill not generated") {
    dispatch(DataBuildingStore(paramsBuildingProgress));
    // }else{

    //   dispatch(DataBuildingStore(paramsBuildingProgress));
    // }
  };
  // table change
  const expandedRowRender = (param) => {
    let data = dataBuilding.dataChild[param.key];
    // console.log("expandedRowRender:", param.imageprogress[0].url)
    const columns = [
      { title: "Start Date",align: "center", dataIndex: "startproject", key: "startDate" },
      { title: "End Date",align: "center", dataIndex: "endproject", key: "endDate" },
      { title: "Name",align: "center", dataIndex: "name", key: "name" },
      { title: "Overview",align: "center", dataIndex: "persentage", key: "overView" },
      { title: "Detail",align: "center", dataIndex: "detail", key: "detail" },
      {
        title: "ProductImage",
        align: "center",
        dataIndex: "productImage",
        key: "productImage",
        render: (text, record) => {
          return (
            <div>
              <img
                width={120}
                height={120}
                src={
                  Array.isArray(param.imageprogress)
                    ? param.imageprogress[0].url
                    : bill
                }
              />
            </div>
          );
        },
      },
    ];

    return (
      <Table
        style={{ whiteSpace: "pre" }}
        columns={columns}
        dataSource={[data]}
        pagination={false}
      />
    );
  };

  const columns = [
    { title: "No.", align: "center", dataIndex: "No", key: "No" },
    {
      title: "Project Name",
      align: "center",
      dataIndex: "subject",
      key: "subject",
      render: (text) => (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={
            paramsBuildingProgress?.filters.subject !== null
              ? paramsBuildingProgress?.filters.subject
              : [""]
          }
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ),
      sorter: (a, b) => {
        a = a.subject || "";
        b = b.subject || "";
        return a.localeCompare(b);
      },
    },
    {
      title: "Location",
      align: "center",
      dataIndex: "Location",
      key: "Location",
      sorter: (a, b) => {
        a = a.Location || "";
        b = b.Location || "";
        return a.localeCompare(b);
      },
    },
    {
      title: "Overall Progresses",
      align: "center",
      dataIndex: "totalProgress",
      key: "totalProgress",
      sorter: (a, b) => {
        a = a.totalProgress || "";
        b = b.totalProgress || "";
        return a.localeCompare(b, undefined, {
          numeric: true,
          sensitivity: "base",
        });
      },
    },
    {
      title: "Published By",
      align: "center",
      dataIndex: "creator",
      key: "creator",
      sorter: (a, b) => {
        a = a.creator || "";
        b = b.creator || "";
        return a.localeCompare(b);
      },
    },
    {
      title: "Lastest Update",
      align: "center",
      dataIndex: "updatedAt",
      key: "updatedAt",
      sorter: (a, b) => {
        a = a.updatedAt || "";
        b = b.updatedAt || "";
        return a.localeCompare(b);
      },
    },
    {
      title: "Action",
      align: "center",
      key: "operation",
      render: (text, record) => (
        <>
          <Row justify="space-between">
            <Col>
              <icon
                icon={<FormOutlined />}
                title="Sure to Edit?"
                id={record.id}
                onClick={handleEdit}
                // onConfirm={() => handleEdit(record)}
              >
                <FormOutlined style={{ fontSize: 18, color: "#1D1C1C" }} />
              </icon>
            </Col>
            <Col>{/*<img src="/main/icons/sep.png" alt="Separate" />*/}</Col>
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
    },
  ];

  return (
    <>
      <CreateBuildModal />
      <ModalEdit />
      <Heading title="Building Progress" />
      <div className="row" style={{ paddingTop: 35, paddingBottom: 20 }}>
        <div className="building_custom">
          <Input
            placeholder={`Search by name`}
            onChange={sreachData}
            prefix={<SearchOutlined />}
          />
        </div>

        <div className="col-8">
          <div className="flex-container">
            <div
              style={{ flex: 1, display: "flex", justifyContent: "flex-end" }}
            >
              {/*{status_billing === "Bill not generated" ?*/}
              <Button
                style={{
                  display: "flex",
                  padding: 10,
                  paddingRight: 10,
                  width: width * 0.1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
                icon={<PlusOutlined />}
                className="buttom_payment1"
                type="Default"
                shape="round"
                onClick={createbuilding}
              >
                {" "}
                Add New Project
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Table
        className="components-table-demo-nested"
        columns={columns}
        onChange={handleTableChange}
        loading={loadingBuilding}
        pagination={PaginationConfig}
        expandable={{ expandedRowRender }}
        dataSource={dataBuilding.dataTop}
      />
    </>
  );
}

export default ProjectProgresses;
