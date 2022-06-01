import React from 'react';
// react router
import { Link } from 'react-router-dom';

//antd components
import { Menu } from 'antd';

//styles sheet
import './styles/side-menu.css';

//icon svg
import MenuLogo from './assets/menu-logo.svg';
import nearbyImg from './assets/nearby.svg';
import announcement from './assets/announcement.svg';
import service from './assets/service.svg';
import logoutIcon from './assets/logout.svg';
import pieIcon from './assets/pie.svg';
import facilitiesIcon from './assets/facilities.svg';
import groupIcon from './assets/group.svg';
import payment from './assets/payment.svg';
import chatIcon from './assets/chat.png';
//service file
import authService from '../services/auth.service';

//antd constraints components
const { SubMenu } = Menu;

function SideMenu() {
  const rootSubmenuKeys = [
    'overview',
    'member',
    'nearby-service',
    'announcement',
    'facilities-management',
    'maintenance',
    'payment',
    'chat',
    'maintenance',
  ];
  const [openKeys, setOpenKeys] = React.useState(['overview']);

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
      <div className="side-menu">
        <div className="menu-logo">
          <img src={MenuLogo} alt="menu-logo" />
        </div>
        <div className="menu-group">
          <Menu
            mode="inline"
            openKeys={openKeys}
            onOpenChange={onOpenChange}
            style={{ width: 300, backgroundColor: 'rgba(32, 38, 58, 1)' }}
          >
            <div className="group-name">Overview</div>
            <SubMenu
              key="overview"
              icon={<img src={pieIcon} alt="member" />}
              title="Monitoring"
            >
              <Menu.Item key="0">
                <Link to="/dashboard/summary">Summary Dashboard</Link>
              </Menu.Item>
            </SubMenu>
            <div className="group-name">Facility Management</div>
            <SubMenu
              key="facilities-management"
              icon={<img src={facilitiesIcon} alt="facilities" />}
              title="Facilities Reservation"
            >
              <Menu.Item key="1">
                <Link to="/dashboard/facilities-reservation-dashboard">
                  Facilities Dashboard
                </Link>
              </Menu.Item>
              <Menu.Item key="2">
                <Link to="/dashboard/facilities-reservation-calendar">
                  Booking Calendar
                </Link>
              </Menu.Item>
              <Menu.Item key="3">
                <Link to="/dashboard/facilities-reservation-list">
                  Booking List
                </Link>
              </Menu.Item>
              <Menu.Item key="4">
                <Link to="/dashboard/facilities-management">Facilities</Link>
              </Menu.Item>
              <Menu.Item key="5">
                <Link to="/dashboard/occupation">Occupation</Link>
              </Menu.Item>
            </SubMenu>
            <SubMenu
              className="sub-menu"
              key="announcement"
              icon={<img src={announcement} alt="announcement" />}
              title="Announcement"
            >
              <Menu.Item key="6" className="menu-item">
                <Link to="/dashboard/announcement">Announcement Lists</Link>
              </Menu.Item>
            </SubMenu>
            <SubMenu
              className="sub-menu"
              key="nearby-service"
              icon={<img src={nearbyImg} alt="nearby" />}
              title="Nearby Service"
            >
              <Menu.Item key="7" className="menu-item">
                <Link to="/dashboard/nearby">Service Lists</Link>
              </Menu.Item>
            </SubMenu>
            <SubMenu
              key="payment"
              icon={<img src={payment} alt="payment" />}
              title="Payment"
            >
              <Menu.Item key="8">
                <Link to="/dashboard/payment-dashboard">Payment Dashboard</Link>
              </Menu.Item>
              <Menu.Item key="9">
                <Link to="/dashboard/payment-billing">Bill Payment</Link>
              </Menu.Item>
            </SubMenu>
            <div className="group-name">User Management</div>
            <SubMenu
              key="member"
              icon={<img src={groupIcon} alt="member" />}
              title="Members"
            >
              <Menu.Item key="10">
                <Link to="/dashboard/members-dashboard">
                  User Management Dashboard
                </Link>
              </Menu.Item>
              <Menu.Item key="11">
                <Link to="/dashboard/members-registration">Registration</Link>
              </Menu.Item>
              <Menu.Item key="12">
                <Link to="/dashboard/rooms-management-dashboard">
                  Room Dashboard
                </Link>
              </Menu.Item>
              <Menu.Item key="13">
                <Link to="/dashboard/rooms-management">Room Management</Link>
              </Menu.Item>
            </SubMenu>
            <SubMenu
              key="chat"
              icon={<img src={chatIcon} width="20" height="20" alt="chat" />}
              title="Live Chat"
            >
              <Menu.Item key="14">
                <Link to="/dashboard/live-chat">Chat</Link>
              </Menu.Item>
            </SubMenu>

            <div className="group-name">Maintenance</div>
            <SubMenu
              className="sub-menu"
              key="maintenance"
              icon={<img src={service} alt="service" />}
              title="Service Center"
            >
              <Menu.Item key="15" className="menu-item">
                <Link to="/dashboard/service-center-dashBoard">
                  Service Center Dashboard
                </Link>
              </Menu.Item>
              <Menu.Item key="16" className="menu-item">
                <Link to="/dashboard/service-center-reports">
                  Service Center Lists
                </Link>
              </Menu.Item>
              <Menu.Item key="17" className="menu-item">
                {/* <Link to='/join-room'>Message</Link> */}
                <Link to="/dashboard/service-chat">Messages</Link>
              </Menu.Item>
            </SubMenu>
            <div className="group-name">Settings</div>
            <div className="logout">
              <img
                src={logoutIcon}
                alt="logout"
                style={{ float: 'left', paddingTop: 5 }}
              />
              <div className="menu-txt">
                <a href="/" onClick={() => authService.logout()}>
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
