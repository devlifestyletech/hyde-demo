import React, { useState, useEffect } from "react";

//import antd component
import { Row, Col, Form, Input, Button, Modal } from "antd";
//import customize css
import "./styles/signin.css";

//import image
import CoverImage from "./assets/images/hyde_building2.png";
import HydeLogo from "./assets/images/hyde-logo.svg";
import UserIcon from "./assets/icons/user.svg";
import PasswordIcon from "./assets/icons/password.svg";

//import service file
import authService from "../services/auth.service";

//import encrypt Storage configure
import { encryptStorage } from "../utils/encryptStorage";

function SignInPage({ fakeAuth }) {
	const [LoginForm] = Form.useForm();

	const onFinish = (value) => {
		authService
			.signIn(value)
			.then((res) => {
				console.log(res.data);
				if (res.data.user.role.type === "resident") {
					Modal.error({
						title: "Error !",
						content: "This web application available for juristic account only.",
						onOk: () => {
							LoginForm.resetFields();
						}
					});
				} else {
					try {
						encryptStorage.setItem("user_session", JSON.stringify(res.data));
						window.location.href = "/";
					} catch (e) {
						console.error(e.message);
					}
				}
			})
			.catch((err) =>
				Modal.error({
					title: "Error !",
					content: "Username or password is incorrect",
					onOk: () => {
						LoginForm.resetFields();
					}
				})
			);
	};
	const onFinishFailed = (error) => {
		console.log(error);
	};

	const { height, width } = useWindowDimensions();
	//Responsive helper login page function
	function getWindowDimensions() {
		const { innerWidth: width, innerHeight: height } = window;
		return {
			width,
			height
		};
	}
	function useWindowDimensions() {
		const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

		useEffect(() => {
			function handleResize() {
				setWindowDimensions(getWindowDimensions());
			}

			window.addEventListener("resize", handleResize);
			return () => window.removeEventListener("resize", handleResize);
		}, []);

		return windowDimensions;
	}

	return (
		<div className='bg'>
			<Row>
				{width < 1180 ? null : (
					<Col style={{ height: "100vh", width: 675 }}>
						<img src={CoverImage} alt='hyde cover' className='cover-image' style={{ height: "100vh" }} />
					</Col>
				)}
				<Col flex='1 1 auto' style={{ textAlign: "center" }}>
					<div className='hyde-logo'>
						<img src={HydeLogo} alt='hyde logo' />
						<div className='login-form'>
							<Form
								layout='vertical'
								style={{ color: "white" }}
								onFinish={onFinish}
								onFinishFailed={onFinishFailed}
								autoComplete='off'
								form={LoginForm}>
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
