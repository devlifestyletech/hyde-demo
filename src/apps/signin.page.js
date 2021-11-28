import React from "react";

//import antd component
import { Row, Col, Form, Input, Button } from "antd";
//import customize css
import "./styles/signin.css";

//import image
import CoverImage from "./assets/images/hyde_building.svg";
import HydeLogo from "./assets/images/hyde-logo.svg";
import UserIcon from "./assets/icons/user.svg";
import PasswordIcon from "./assets/icons/password.svg";

function SignInPage({ fakeAuth }) {
	const onFinish = (value) => {
		console.log(value);
		fakeAuth();
	};
	const onFinishFailed = (error) => {
		console.log(error);
	};
	return (
		<div className='bg'>
			<Row>
				<Col style={{ height: "100vh", width: 800 }}>
					<img src={CoverImage} alt='hyde cover' className='cover-image' style={{ height: "100vh" }} />
				</Col>
				<Col flex='1 1 auto'>
					<div className='hyde-logo'>
						<img src={HydeLogo} alt='hyde logo' />
						<div className='login-form'>
							<Form layout='vertical' style={{ color: "white" }} onFinish={onFinish} onFinishFailed={onFinishFailed} autoComplete='off'>
								<Form.Item
									label='Username'
									name='identifier'
									rules={[
										{
											required: true,
											message: "Please input your username!"
										}
									]}>
									<Input prefix={<img src={UserIcon} alt='user' />} />
								</Form.Item>
								<Form.Item
									label='Password'
									name='password'
									rules={[
										{
											required: true,
											message: "Please input your password!"
										}
									]}>
									<Input.Password prefix={<img src={PasswordIcon} alt='password' />} />
								</Form.Item>
								<Form.Item>
									<Button htmlType='submit'>Login</Button>
								</Form.Item>
							</Form>
						</div>
					</div>
				</Col>
			</Row>
		</div>
	);
}

export default SignInPage;
