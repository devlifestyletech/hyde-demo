import React from "react";
// react router
import { Link } from "react-router-dom";

//antd components
import { Menu } from "antd";
import { AppstoreOutlined, MailOutlined, SettingOutlined } from "@ant-design/icons";

//styles sheet
import "./styles/side-menu.css";

//icon svg
import MenuLogo from "./assets/menu-logo.svg";
import nearbyImg from "./assets/nearby.svg";
import announcement from "./assets/announcement.svg";
import service from "./assets/service.svg";
import logoutIcon from "./assets/logout.svg";
import pieIcon from "./assets/pie.svg";
import facilitiesIcon from "./assets/facilities.svg";
import groupIcon from "./assets/group.svg";

//service file
import authService from "../services/auth.service";

//antd constraints components
const { SubMenu } = Menu;

function SideMenu() {
	const rootSubmenuKeys = ["overview", "member", "nearby-service", "announcement", "facilities-management", "maintenance"];
	const [openKeys, setOpenKeys] = React.useState(["overview"]);

	const onOpenChange = (keys) => {
		const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
		if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
			setOpenKeys(keys);
		} else {
			setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
		}
	};

	return (
		<>
			<div className='side-menu'>
				<div className='menu-logo'>
					<img src={MenuLogo} alt='menu-logo' />
				</div>
				<div className='menu-group'>
					<Menu mode='inline' openKeys={openKeys} onOpenChange={onOpenChange} style={{ width: 300, backgroundColor: "rgba(32, 38, 58, 1)" }}>
						<div className='group-name'>Overview</div>
						<SubMenu key='overview' icon={<img src={pieIcon} alt='member' />} title='Monitoring'>
							<Menu.Item key='0'>
								<Link to='/'>Summary Dashboard</Link>
							</Menu.Item>
						</SubMenu>
						<div className='group-name'>Facility Management</div>
						<SubMenu key='facilities-management' icon={<img src={facilitiesIcon} alt='facilities' />} title='Facilities Reservation'>
							<Menu.Item key='1'>
								<Link to='/facility-reservation'>Facilities Dashboard</Link>
							</Menu.Item>
							<Menu.Item key='2'>
								<Link to='/facility-reservation/calendar'>Booking Calendar</Link>
							</Menu.Item>
							<Menu.Item key='3'>
								<Link to='/facility-reservation/list'>Booking List</Link>
							</Menu.Item>
							<Menu.Item key='4'>
								<Link to='/facility-reservation/facilities'>Facilities</Link>
							</Menu.Item>
							<Menu.Item key='5'>
								<Link to='/facility-reservation/occupation'>Occupation</Link>
							</Menu.Item>
						</SubMenu>
						<SubMenu className='sub-menu' key='announcement' icon={<img src={announcement} alt='announcement' />} title='Announcement'>
							<Menu.Item key='6' className='menu-item'>
								<Link to='/announcement'>Announcement Lists</Link>
							</Menu.Item>
						</SubMenu>
						<SubMenu className='sub-menu' key='nearby-service' icon={<img src={nearbyImg} alt='nearby' />} title='Nearby Service'>
							<Menu.Item key='7' className='menu-item'>
								<Link to='/nearby'>Service Lists</Link>
							</Menu.Item>
						</SubMenu>
						<div className='group-name'>User Management</div>
						<SubMenu key='member' icon={<img src={groupIcon} alt='member' />} title='Members'>
							<Menu.Item key='8'>
								<Link to='/members'>User Management Dashboard</Link>
							</Menu.Item>
							<Menu.Item key='9'>
								<Link to='/members/registration'>Registration</Link>
							</Menu.Item>
						</SubMenu>
						<div className='group-name'>Maintenance</div>
						<SubMenu className='sub-menu' key='maintenance' icon={<img src={service} alt='service' />} title='Service Center'>
							<Menu.Item key='10' className='menu-item'>
								<Link to='/service-center-dashBoard'>Service Center Dashboard</Link>
							</Menu.Item>
							<Menu.Item key='11' className='menu-item'>
								<Link to='/service-center-reports'>Service Center Lists</Link>
							</Menu.Item>
							<Menu.Item key='12' className='menu-item'>
								<Link to='/service-center-message'>Message</Link>
							</Menu.Item>
						</SubMenu>
						<div className='group-name'>Settings</div>
						<div className='logout'>
							<img src={logoutIcon} alt='logout' style={{ float: "left", paddingTop: 5 }} />
							<div className='menu-txt'>
								<a href='/' onClick={() => authService.logout()}>
									Logout
								</a>
							</div>
						</div>
					</Menu>
				</div>
			</div>
		</>
	);
}

export default SideMenu;
