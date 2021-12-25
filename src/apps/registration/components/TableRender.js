import React, { useState, useEffect } from "react";
import { Button, Divider, Table, Modal, message, Spin } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";

//image import from
import editIcon from "../assets/icons/edit.svg";
import trashIcon from "../assets/icons/trash.svg";
import EditModal from "./EditModal";
import authService from "../../../services/auth.service";

export default function TableRender({ data, key, onEvent }) {
	const [user, setUser] = useState();
	const [EditModalVisibility, setEditModalVisibility] = useState(false);
	const [handleId, setHandleId] = useState(null);

	useEffect(() => {
		authService.getUserData(handleId).then((res) => {
			setUser(res.data);
		});
	}, [handleId]);

	const handleClickEdit = (id) => {
		setHandleId(id);
		setEditModalVisibility(true);
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
				authService.deleteUser(id).then((res) => {
					message.success("Delete success!");
					onEvent();
				});
			},
			onCancel() {
				console.log("Cancel");
			}
		});
	}

	console.log(user);
	const columns = [
		{
			title: "No.",
			dataIndex: "number",
			key: "index"
		},
		{
			title: "Address",
			dataIndex: "address",
			key: "index",
			render: (address) => <div>{address.address_number}</div>
		},
		{
			title: "Owner",
			dataIndex: "fullname",
			key: "index"
		},
		{
			title: "Nationality",
			dataIndex: "nationality",
			key: "index"
		},
		{
			title: "Type",
			dataIndex: "project",
			key: "index",
			render: (project) => <div>{project.project_type}</div>
		},
		{
			title: "Tel",
			dataIndex: "tel",
			key: "index"
		},
		{
			title: "E-mail",
			dataIndex: "email",
			key: "index"
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
			<Table key={key} dataSource={data} columns={columns} />
			<EditModal
				key={key}
				visible={EditModalVisibility}
				onCancel={() => {
					setEditModalVisibility(false);
				}}
				user={user}
			/>
		</div>
	);
}
