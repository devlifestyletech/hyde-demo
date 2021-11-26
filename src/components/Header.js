import React from "react";
import "./styles/header.css";
import { Button } from "antd";
import NotiIcon from "./assets/bell.svg";
function Header({ title }) {
	return (
		<div className='heading'>
			<div className='title'>
				{title}
				<Button className='bell' type='link' icon={<img src={NotiIcon} alt='notification' />} />
			</div>
		</div>
	);
}

export default Header;
