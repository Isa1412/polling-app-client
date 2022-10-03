import React from 'react';
import {Link} from "react-router-dom";
import {Button, Form, Input, notification} from "antd";
import {LockOutlined, UserOutlined} from '@ant-design/icons';
import '../styles/Login.css';
import PollService from "../API/PollService";
import {ACCESS_TOKEN} from "../constants/Constants";

const Login = ({onLogin}) => {

    const onFinish = values => {
        const loginRequest = Object.assign({}, values);

        PollService.login(loginRequest)
            .then(response => {
                localStorage.setItem(ACCESS_TOKEN, response.accessToken);
                onLogin();
            }).catch(error => {
                if (error.response.status === 401) {
                    notification.error({
                        message: 'Polling App',
                        description: 'Your Username or Password is incorrect. Please try again!'
                    });
                } else {
                    notification.error({
                        message: 'Polling App',
                        description: error.message || 'Sorry! Something went wrong. Please try again!'
                    });
                }
        });
    }

    return (
        <div className="login-container">
            <h1 className="page-title">Login</h1>
            <div className="login-content">
                <Form onFinish={onFinish} className="login-form">
                    <Form.Item
                        name="usernameOrEmail"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your username or email!'
                            }
                        ]}
                    >
                        <Input
                            prefix={<UserOutlined/>}
                            size="large"
                            name="usernameOrEmail"
                            placeholder="Username or Email"
                        />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your Password!'
                            }
                        ]}>
                        <Input
                            prefix={<LockOutlined/>}
                            size="large"
                            name="password"
                            type="password"
                            placeholder="Password"
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            size="large"
                            className="login-form-button"
                        >
                            Login
                        </Button>
                        Or <Link to="/signup">register now!</Link>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default Login;