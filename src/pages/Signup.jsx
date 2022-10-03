import React, {useState} from 'react';
import {Link, useNavigate} from "react-router-dom";
import {Button, Form, Input, notification} from "antd";
import '../styles/Signup.css';
import PollService from '../API/PollService';
import {
    EMAIL_MAX_LENGTH,
    NAME_MAX_LENGTH,
    NAME_MIN_LENGTH,
    PASSWORD_MAX_LENGTH,
    PASSWORD_MIN_LENGTH,
    USERNAME_MAX_LENGTH,
    USERNAME_MIN_LENGTH
} from "../constants/Constants";

const Signup = () => {
    const [name, setName] = useState({});
    const [username, setUsername] = useState({});
    const [email, setEmail] = useState({});
    const [password, setPassword] = useState({});
    const navigate = useNavigate();

    const onFinish = () => {
        const signupRequest = {
            name: name.value,
            email: email.value,
            username: username.value,
            password: password.value
        };

        PollService.signup(signupRequest)
            .then(() => {
                notification.success({
                    message: 'Polling App',
                    description: "Thank you! You're successfully registered. Please Login to continue!"
                });
                navigate("/login");
            }).catch(error => {
                notification.error({
                    message: 'Polling App',
                    description: error.message || 'Sorry! Something went wrong. Please try again!'
                });
        });
    }

    const validateName = event => {
        const value = event.target.value;

        if(value.length < NAME_MIN_LENGTH) {
            setName({
                value: value,
                validateStatus: 'error',
                errorMsg: `Name is too short (Minimum ${NAME_MIN_LENGTH} characters needed.)`
            });
        } else if (value.length > NAME_MAX_LENGTH) {
            setName({
                value: value,
                validateStatus: 'error',
                errorMsg: `Name is too long (Maximum ${NAME_MAX_LENGTH} characters allowed.)`
            });
        } else {
            setName({
                value: value,
                validateStatus: 'success',
                errorMsg: ''
            });
        }
    }

    const validateUsername = event => {
        const value = event.target.value;

        if(value.length < USERNAME_MIN_LENGTH) {
            setUsername({
                value: value,
                validateStatus: 'error',
                errorMsg: `Username is too short (Minimum ${USERNAME_MIN_LENGTH} characters needed.)`
            });
        } else if (value.length > USERNAME_MAX_LENGTH) {
            setUsername({
                value: value,
                validateStatus: 'error',
                errorMsg: `Username is too long (Maximum ${USERNAME_MAX_LENGTH} characters allowed.)`
            });
        } else {
            setUsername({
                value: value,
                validateStatus: 'success',
                errorMsg: ''
            });
        }
    }

    const validateEmail = event => {
        const value = event.target.value;
        const EMAIL_REGEX = RegExp('[^@ ]+@[^@ ]+\\.[^@ ]+');

        if(value.length === 0) {
            setEmail({
                value: value,
                validateStatus: 'error',
                errorMsg: 'Email may not be empty'
            });
        } else if(value.length > EMAIL_MAX_LENGTH) {
            setEmail({
                value: value,
                validateStatus: 'error',
                errorMsg: `Email is too long (Maximum ${EMAIL_MAX_LENGTH} characters allowed)`
            });
        } else if(!EMAIL_REGEX.test(value)) {
            setEmail({
                value: value,
                validateStatus: 'error',
                errorMsg: 'Email not valid'
            });
        } else {
            setEmail({
                value: value,
                validateStatus: 'success',
                errorMsg: ''
            });
        }
    }

    const validatePassword = event => {
        const value = event.target.value;

        if(value.length < PASSWORD_MIN_LENGTH) {
            setPassword({
                value: value,
                validateStatus: 'error',
                errorMsg: `Password is too short (Minimum ${PASSWORD_MIN_LENGTH} characters needed.)`
            });
        } else if (value.length > PASSWORD_MAX_LENGTH) {
            setPassword({
                value: value,
                validateStatus: 'error',
                errorMsg: `Password is too long (Maximum ${PASSWORD_MAX_LENGTH} characters allowed.)`
            });
        } else {
            setPassword({
                value: value,
                validateStatus: 'success',
                errorMsg: ``
            });
        }
    }

    const validateUsernameAvailability = async () => {
        if (username.validateStatus === 'success') {
            setUsername({
                value: username.value,
                validateStatus: 'validating',
                errorMsg: ''
            });

            await PollService.checkUsernameAvailability(username.value)
                .then(response => {
                    if (response.available) {
                        setUsername({
                            value: username.value,
                            validateStatus: 'success',
                            errorMsg: ''
                        });
                    } else {
                        setUsername({
                            value: username.value,
                            validateStatus: 'error',
                            errorMsg: 'This username is already taken'
                        });
                    }
                }).catch(() => {
                    //Marking validateStatus as success, form will be rechecked at server
                    setUsername({
                        value: username.value,
                        validateStatus: 'success',
                        errorMsg: ''
                    });
                });
        }
    }

    const validateEmailAvailability = async () => {
        if (email.validateStatus === 'success') {
            setEmail({
                value: username.value,
                validateStatus: 'validating',
                errorMsg: ''
            });

            await PollService.checkEmailAvailability(email.value)
                .then(response => {
                    if (response.available) {
                        setEmail({
                            value: email.value,
                            validateStatus: 'success',
                            errorMsg: ''
                        });
                    } else {
                        setEmail({
                            value: email.value,
                            validateStatus: 'error',
                            errorMsg: 'This Email is already registered'
                        });
                    }
                }).catch(() => {
                    //Marking validateStatus as success, form will be rechecked at server
                    setEmail({
                        value: email.value,
                        validateStatus: 'success',
                        errorMsg: ''
                    });
                });
        }
    }

    const isFormInvalid = () => {
        return !(name.validateStatus === 'success' &&
            username.validateStatus === 'success' &&
            email.validateStatus === 'success' &&
            password.validateStatus === 'success'
        );
    }

    return (
        <div className="signup-container">
            <h1 className="page-title">Sign Up</h1>
            <div className="signup-content">
                <Form
                    layout="vertical"
                    onFinish={onFinish}
                    className="signup-form"
                >
                    <Form.Item
                        label="Full Name:"
                        validateStatus={name.validateStatus}
                        help={name.errorMsg}
                    >
                        <Input
                            size="large"
                            name="name"
                            autoComplete="off"
                            placeholder="Your full name"
                            value={name.value}
                            onChange={validateName}
                        />
                    </Form.Item>
                    <Form.Item
                        label="Username:"
                        hasFeedback
                        validateStatus={username.validateStatus}
                        help={username.errorMsg}
                    >
                        <Input
                            size="large"
                            name="username"
                            autoComplete="off"
                            placeholder="A unique username"
                            value={username.value}
                            onChange={validateUsername}
                            onBlur={validateUsernameAvailability}
                        />
                    </Form.Item>
                    <Form.Item
                        label="Email:"
                        hasFeedback
                        validateStatus={email.validateStatus}
                        help={email.errorMsg}
                    >
                        <Input
                            size="large"
                            name="email"
                            type="email"
                            autoComplete="off"
                            placeholder="Your email"
                            value={email.value}
                            onChange={validateEmail}
                            onBlur={validateEmailAvailability}
                        />
                    </Form.Item>
                    <Form.Item
                        label="Password:"
                        validateStatus={password.validateStatus}
                        help={password.errorMsg}
                    >
                        <Input
                            size="large"
                            name="password"
                            type="password"
                            autoComplete="off"
                            placeholder="A password between 6 to 20 characters"
                            value={password.value}
                            onChange={validatePassword}
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary"
                                htmlType="submit"
                                size="large"
                                className="signup-form-button"
                                disabled={isFormInvalid()}
                        >
                            Sign up
                        </Button>
                        Already registered? <Link to="/login">Login now!</Link>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default Signup;