import React, { useState } from "react";
import { Button, Divider, Table, Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";

//image import from
import editIcon from "../assets/icons/edit.svg";
import trashIcon from "../assets/icons/trash.svg";
import EditModal from "./EditModal";

export default function TableRender({ data }) {
	const [EditModalVisibility, setEditModalVisibility] = useState(false);
	const [handleId, setHandleId] = useState(null);

	const handleClickEdit = (id) => {
		setEditModalVisibility(true);
		setHandleId(id);
	};
	function handleClickDelete(id) {
		Modal.confirm({
			maskStyle: {
				borderRadius: 20
			},
			title: "Do you Want to delete this user?",
			icon: <ExclamationCircleOutlined />,
			content: "This user has been deleted from the database",
			okType: "danger",
			okText: "Confirm",
			okButtonProps: { shape: "round" },
			cancelButtonProps: { shape: "round" },
			onOk() {
				console.log("OK");
			},
			onCancel() {
				console.log("Cancel");
			}
		});
	}

	console.log(data);
	const columns = [
		{
			title: "No.",
			dataIndex: "id",
			key: "index"
		},
		{
			title: "Address",
			dataIndex: "address",
			key: "index"
		},
		{
			title: "Owner",
			dataIndex: "fullname",
			key: "index",
			sorter: (a, b) => a.fullname - b.fullname
		},
		{
			title: "Nationality",
			dataIndex: "nationality",
			key: "index",
			sorter: (a, b) => a.nationality - b.nationality
		},
		{
			title: "Type",
			dataIndex: "type",
			key: "index",
			sorter: (a, b) => a.type - b.type
		},
		{
			title: "Tel",
			dataIndex: "tel",
			key: "index"
		},
		{
			title: "E-mail",
			dataIndex: "email",
			key: "index",
			sorter: (a, b) => a.email - b.email
		},
		{
			title: "Action",
			dataIndex: "id",
			key: "index",
			render: (id) => (
				<div style={{ borderRadius: 20 }}>
					<Button type='link' onClick={() => handleClickEdit(id)} icon={<img src={editIcon} alt='Edit' />} />
					<Divider type='vertical' style={{ height: 30 }} />
					<Button type='link' onClick={() => handleClickDelete(id)} icon={<img src={trashIcon} alt='Delete' />} />
				</div>
			)
		}
	];
	return (
		<div>
			<Table dataSource={data} columns={columns} />
			<EditModal visible={EditModalVisibility} onCancel={() => setEditModalVisibility(false)} user={data.find((user) => user.id === handleId)} />
		</div>
	);
}
