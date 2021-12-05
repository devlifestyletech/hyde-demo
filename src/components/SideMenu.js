import React from "react";
import { Menu } from "antd";
import "./styles/side-menu.css";
import MenuLogo from "./assets/menu-logo.svg";
import nearbyImg from "./assets/nearby.svg";
import { AppstoreOutlined, MailOutlined, SettingOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import groupIcon from "./assets/group.svg";
const { SubMenu } = Menu;

function SideMenu() {
	const rootSubmenuKeys = ["member"];
	const [openKeys, setOpenKeys] = React.useState(["member"]);

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
					<p className='group-name'>User Management</p>
					<Menu mode='inline' openKeys={openKeys} onOpenChange={onOpenChange} style={{ width: 300, backgroundColor: "rgba(32, 38, 58, 1)" }}>
						<SubMenu key='member' icon={<img src={groupIcon} alt='member' />} title='Members'>
							<Menu.Item key='1'>
								<Link to='/members'>User Management Dashboard</Link>
							</Menu.Item>
							<Menu.Item key='2'>
								<Link to='/members/registration'>Registration</Link>
							</Menu.Item>
						</SubMenu>
						<SubMenu
          className="sub-menu"
          key="nearby-service"
          icon={<img src={nearbyImg} alt="nearby" />}
          title="Nearby Service"
        >
          <Menu.Item key="3" className="menu-item">
            <Link to="/nearby">Service Lists</Link>
          </Menu.Item>
        </SubMenu>
					</Menu>
				</div>
			</div>
		</>
	);
}

export default SideMenu;
