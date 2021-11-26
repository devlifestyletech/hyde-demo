import React, { useState } from "react";
import { Tabs, Input, Button } from "antd";
import TableRender from "../components/TableRender";
import { users } from "../components/user-data";
import Header from "../../../components/Header";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import "./styles/registration.css";
import CreateModal from "../components/CreateModal";

const { TabPane } = Tabs;
function Registration() {
	const [createModalVisibility, setCreateModalVisibility] = useState(false);
	let all_user = users;
	let owner_users = users.filter((user) => user.type === "Owner");
	let inhabitant_users = users.filter((user) => user.type === "Inhabitant");
	let tenant_users = users.filter((user) => user.type === "Tenant");

	return (
		<>
			<Header title='Registration' />
			<div className='regis-helper'>
				<Input prefix={<SearchOutlined />} size='large' shape='round' placeholder='Search by name' />
				<Button shape='round' size='large' icon={<PlusOutlined />} onClick={() => setCreateModalVisibility(true)}>
					Add New
				</Button>
			</div>
			<br />
			<div className='regis-table'>
				<Tabs>
					<TabPane tab='All' key='1'>
						<TableRender data={all_user} />
					</TabPane>
					<TabPane tab='Owner' key='2'>
						<TableRender data={owner_users} />
					</TabPane>
					<TabPane tab='Inhabitant' key='3'>
						<TableRender data={inhabitant_users} />
					</TabPane>
					<TabPane tab='Tenant' key='4'>
						<TableRender data={tenant_users} />
					</TabPane>
				</Tabs>
			</div>
			<CreateModal visible={createModalVisibility} onCancel={() => setCreateModalVisibility(false)} />
		</>
	);
}

export default Registration;
