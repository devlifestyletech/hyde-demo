import React from "react";
import { Tabs, Input } from "antd";
import TableRender from "../components/TableRender";
import { users } from "../components/user-data";
import Header from "../../../components/Header";
import { SearchOutlined } from "@ant-design/icons";
import "./styles/registration.css";

const { TabPane } = Tabs;
function Registration() {
	let all_user = users;
	let owner_users = users.filter((user) => user.type === "Owner");
	let inhabitant_users = users.filter((user) => user.type === "Inhabitant");
	let tenant_users = users.filter((user) => user.type === "Tenant");

	return (
		<>
			<Header title='Registration' />
			<div className='regis-helper'>
				<Input prefix={<SearchOutlined />} size='large' shape='round' placeholder='Search by name' />
			</div>
			<br />
			<div className='regis-table'>
				<Tabs>
					<TabPane tab='All' key='1'>
						<TableRender data={all_user} key='1' />
					</TabPane>
					<TabPane tab='Owner' key='2'>
						<TableRender data={owner_users} key='2' />
					</TabPane>
					<TabPane tab='Inhabitant' key='3'>
						<TableRender data={inhabitant_users} key='3' />
					</TabPane>
					<TabPane tab='Tenant' key='4'>
						<TableRender data={tenant_users} key='4' />
					</TabPane>
				</Tabs>
			</div>
		</>
	);
}

export default Registration;
