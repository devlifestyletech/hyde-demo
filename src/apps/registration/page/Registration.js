import React, { useState, useEffect } from "react";
import { Tabs, Input, Button } from "antd";
import TableRender from "../components/TableRender";
import Header from "../../../components/Header";
import { SearchOutlined, PlusOutlined } from "@ant-design/icons";
import "./styles/registration.css";
import authService from "../../services/auth.service";
import CreateModal from "../components/CreateModal";

const { TabPane } = Tabs;
function Registration() {
	const [residents, setResidents] = useState([]);
	const [addNewModalVisibility, setAddNewModalVisibility] = useState(false);

	useEffect(() => {
		authService.getAllResident().then((res) => {
			let data = [];
			res.data.forEach((res, index) => {
				let user = {
					number: index + 1,
					...res
				};
				data.push(user);
			});
			setResidents(data);
		});
	}, []);

	console.log(residents);

	return (
		<>
			<Header title='Registration' />
			<div className='regis-helper'>
				<Input prefix={<SearchOutlined />} size='large' shape='round' placeholder='Search by name' />
				<Button shape='round' type='primary' icon={<PlusOutlined />} size='large' onClick={() => setAddNewModalVisibility(true)}>
					Add new
				</Button>
			</div>
			<br />
			<div className='regis-table'>
				<Tabs>
					<TabPane tab='All' key='1'>
						<TableRender data={residents} key='1' />
					</TabPane>
					{/* <TabPane tab='Owner' key='2'>
						<TableRender data={owner_users} key='2' />
					</TabPane>
					<TabPane tab='Inhabitant' key='3'>
						<TableRender data={inhabitant_users} key='3' />
					</TabPane>
					<TabPane tab='Tenant' key='4'>
						<TableRender data={tenant_users} key='4' />
					</TabPane> */}
				</Tabs>
			</div>
			<CreateModal visible={addNewModalVisibility} onCancel={()=> setAddNewModalVisibility(false)}/>
		</>
	);
}

export default Registration;
