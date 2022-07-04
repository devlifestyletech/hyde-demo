import React, { useState } from 'react';

import { Link } from 'react-router-dom';

import { Menu } from 'antd';
import { encryptStorage } from '../utils/encryptStorage';

import './styles/side-menu.css';

//icon svg
import MenuLogo from './assets/menu-logo.svg';
import serviceIcon from './assets/service.svg';
import facilitiesIcon from './assets/facility_reservation.svg';
import groupIcon from './assets/group.svg';
import paymentIcon from './assets/payment.svg';
import settingIcon from './assets/setting.svg';

import { ReactComponent as AnnouncementInActiveIcon } from './assets/icons/announce.svg';
import { ReactComponent as AnnouncementActiveIcon } from './assets/icons/announce_2.svg';
import { ReactComponent as MonitoringInActiveIcon } from './assets/icons/monitoring_inactive.svg';
import { ReactComponent as MonitoringActiveIcon } from './assets/icons/monitoring_active.svg';
import { ReactComponent as ChatActiveIcon } from './assets/icons/chat_active.svg';
import { ReactComponent as ChatInActiveIcon } from './assets/icons/chat_inactive.svg';
import { ReactComponent as NearbyInActiveIcon } from './assets/icons/nearby.svg';
import { ReactComponent as NearbyActiveIcon } from './assets/icons/nearby_active.svg';

import authService from '../services/auth.service';

//antd constraints components
const { SubMenu } = Menu;
const main_link = '/dashboard';
let path = window.location.pathname.split('/');

function NewSideMenu() {
  let session = encryptStorage.getItem('user_session');

  const [openKeys, setOpenKeys] = useState([path[2]]);
  const [activeKeys, setActiveKeys] = useState(window.location.pathname);
  const [activeKeysPath, setActiveKeysPath] = useState();

  const rootSubmenuKeys = ['facilities', 'members', 'services', 'payment'];

  const onOpenChange = (keys) => {
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);

    if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      setOpenKeys(keys);
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }
  };
  console.log(session);

  return (
    <React.Fragment>
      <div className="side-menu">
        <div className="menu-logo">
          <img src={MenuLogo} alt="menu-logo" />
        </div>
        <div className="menu-group">
          <Menu
            defaultSelectedKeys={window.location.pathname}
            onOpenChange={onOpenChange}
            openKeys={openKeys}
            onClick={(k) => {
              setActiveKeysPath(k.keyPath.slice(-1));
              setActiveKeys(k.key);
            }}
            mode="inline"
            style={{ width: 300, backgroundColor: 'rgba(32, 38, 58, 1)' }}
          >
            <div className={'group-name'}>Overview</div>
            <Menu.Item
              onClick={() => setOpenKeys([])}
              key={`${main_link}/summary`}
              icon={
                activeKeys === `${main_link}/summary` ? (
                  <MonitoringActiveIcon className={'menu_icon'} />
                ) : (
                  <MonitoringInActiveIcon className={'menu_icon'} />
                )
              }
            >
              <Link to={`${main_link}/summary`}>Monitoring</Link>
            </Menu.Item>
            <div className={'group-name'}>Management</div>
            <SubMenu
              key="facilities"
              icon={
                <img
                  src={facilitiesIcon}
                  alt="booking"
                  width={20}
                  height={20}
                />
              }
              title="Facilities Reservation"
            >
              <Menu.Item key={`${main_link}/facilities/reservation-dashboard`}>
                <Link to={`${main_link}/facilities/reservation-dashboard`}>
                  Facility Dashboard
                </Link>
              </Menu.Item>
              <Menu.Item key={`${main_link}/facilities/reservation-calendar`}>
                <Link to={`${main_link}/facilities/reservation-calendar`}>
                  Reservation Calendar
                </Link>
              </Menu.Item>
              <Menu.Item key={`${main_link}/facilities/reservation-list`}>
                <Link to={`${main_link}/facilities/reservation-list`}>
                  Reservation List
                </Link>
              </Menu.Item>
              <Menu.Item key={`${main_link}/facilities/management`}>
                <Link to={`${main_link}/facilities/management`}>
                  Facilities
                </Link>
              </Menu.Item>
              <Menu.Item key={`${main_link}/facilities/occupation`}>
                <Link to={`${main_link}/facilities/occupation`}>
                  Occupation
                </Link>
              </Menu.Item>
            </SubMenu>
            <Menu.Item
              onClick={() => setOpenKeys([])}
              key={`${main_link}/announcement`}
              icon={
                activeKeys === `${main_link}/announcement` ? (
                  <AnnouncementActiveIcon className="menu_icon" />
                ) : (
                  <AnnouncementInActiveIcon className="menu_icon" />
                )
              }
            >
              <Link to={`${main_link}/announcement`}>Announcement</Link>
            </Menu.Item>
            <Menu.Item
              onClick={() => setOpenKeys([])}
              key={`${main_link}/nearby`}
              icon={
                activeKeys === `${main_link}/nearby` ? (
                  <NearbyActiveIcon className="menu_icon" />
                ) : (
                  <NearbyInActiveIcon className="menu_icon" />
                )
              }
            >
              <Link to={`${main_link}/nearby`}>Nearby</Link>
            </Menu.Item>
            <div className={'group-name'}>User Management</div>
            <SubMenu
              key="members"
              icon={<img src={groupIcon} alt="chat" />}
              title="Members"
            >
              <Menu.Item key={`${main_link}/members/dashboard`}>
                <Link to={`${main_link}/members/dashboard`}>
                  User Management Dashboard
                </Link>
              </Menu.Item>
              <Menu.Item key={`${main_link}/members/registration`}>
                <Link to={`${main_link}/members/registration`}>
                  Registration
                </Link>
              </Menu.Item>
              <Menu.Item key={`${main_link}/members/rooms-management`}>
                <Link to={`${main_link}/members/rooms-management`}>
                  Room Management
                </Link>
              </Menu.Item>
              {/* {user?.role?.type !== ''} */}
            </SubMenu>
            <Menu.Item
              onClick={() => setOpenKeys([])}
              key={`${main_link}/live-chat`}
              icon={
                activeKeys === `${main_link}/live-chat` ? (
                  <ChatActiveIcon className="menu_icon" />
                ) : (
                  <ChatInActiveIcon className="menu_icon" />
                )
              }
            >
              <Link to={`${main_link}/live-chat`}>Chat</Link>
            </Menu.Item>
            <div className={'group-name'}>Maintenance</div>
            <SubMenu
              key="services"
              icon={<img src={serviceIcon} alt="chat" />}
              title="Service Center"
            >
              <Menu.Item key={`${main_link}/services/dashboard`}>
                <Link to={`${main_link}/services/dashboard`}>
                  Service Center Dashboard
                </Link>
              </Menu.Item>
              <Menu.Item key={`${main_link}/services/reports`}>
                <Link to={`${main_link}/services/reports`}>
                  Service Center List
                </Link>
              </Menu.Item>
              <Menu.Item key={`${main_link}/services/chat`}>
                <Link to={`${main_link}/services/chat`}>Message</Link>
              </Menu.Item>
            </SubMenu>
            <SubMenu
              key="payment"
              icon={<img src={paymentIcon} alt="payment" />}
              title="Payment"
            >
              <Menu.Item key={`${main_link}/payment/dashboard`}>
                <Link to={`${main_link}/payment/dashboard`}>
                  Payment Dashboard
                </Link>
              </Menu.Item>
              <Menu.Item key={`${main_link}/payment/billing`}>
                <Link to={`${main_link}/payment/billing`}>Bill payment</Link>
              </Menu.Item>
            </SubMenu>
            <div className="group-name">Settings</div>
            <SubMenu
              key="settings"
              icon={<img src={settingIcon} alt="payment" />}
              title="Settings"
            >
              <Menu.Item key={`${main_link}/settings/signout`}>
                <a href="/" onClick={() => authService.signOut()}>
                  Sign Out
                </a>
              </Menu.Item>
            </SubMenu>
          </Menu>
        </div>
      </div>
    </React.Fragment>
  );
}

export default NewSideMenu;
