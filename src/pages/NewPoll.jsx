import React, {useState} from 'react';
import {useNavigate} from "react-router-dom";
import {Button, Col, Form, Input, notification, Row, Select} from 'antd';
import {CloseOutlined, PlusOutlined} from "@ant-design/icons";
import '../styles/NewPoll.css';
import PollService from "../API/PollService";
import {MAX_CHOICES, POLL_CHOICE_MAX_LENGTH, POLL_QUESTION_MAX_LENGTH} from '../constants/Constants';

const {TextArea} = Input;
const {Option} = Select;

const NewPoll = ({handleLogout}) => {
    const [question, setQuestion] = useState({text: ''});
    const [choices, setChoices] = useState([{text: ''}, {text: ''}]);
    const [pollLength, setPollLength] = useState({days: 1, hours: 0});
    const navigate = useNavigate();

    const onFinish = () => {
        const pollData = {
            question: question.text,
            choices: choices.map(choice => {
                return {text: choice.text}
            }),
            pollLength: pollLength
        }

        PollService.createPoll(pollData)
            .then(() => {
                navigate("/");
            }).catch(error => {
                if (error.response.status === 401) {
                    handleLogout('/login', 'error', 'You have been logged out. Please login create poll.');
                } else {
                    notification.error({
                        message: 'Polling App',
                        description: error.message || 'Sorry! Something went wrong. Please try again!'
                    });
                }
        });
    }

    const validateQuestion = (questionText) => {
        if (questionText.length === 0) {
            return {
                validateStatus: 'error',
                errorMsg: 'Please enter your question!'
            }
        } else if (questionText.length > POLL_QUESTION_MAX_LENGTH) {
            return {
                validateStatus: 'error',
                errorMsg: `Question is too long (Maximum ${POLL_QUESTION_MAX_LENGTH} characters allowed)`
            }
        } else {
            return {
                validateStatus: 'success',
                errorMsg: ''
            }
        }
    }

    const handleQuestionChange = (event) => {
        const value = event.target.value;

        setQuestion({
            text: value,
            ...validateQuestion(value)
        })
    }

    const addChoice = () => {
        setChoices([
            ...choices,
            {text: ''}
        ])
    }

    const removeChoice = (choiceNumber) => {
        setChoices([
            ...choices.slice(0, choiceNumber),
            ...choices.slice(choiceNumber + 1)
        ])
    }

    const validateChoice = (choiceText) => {
        if (choiceText.length === 0) {
            return {
                validateStatus: 'error',
                errorMsg: 'Please enter a choice!'
            }
        } else if (choiceText.length > POLL_CHOICE_MAX_LENGTH) {
            return {
                validateStatus: 'error',
                errorMsg: `Choice is too long (Maximum ${POLL_CHOICE_MAX_LENGTH} characters allowed)`
            }
        } else {
            return {
                validateStatus: 'success',
                errorMsg: ''
            }
        }
    }

    const handleChoiceChange = (event, index) => {
        const value = event.target.value;

        setChoices([
            ...choices.slice(0, index),
            {text: value, ...validateChoice(value)},
            ...choices.slice(index + 1)
        ])
    }

    const handlePollDaysChange = (value) => {
        setPollLength(
            Object.assign(pollLength, {days: value})
        )
    }

    const handlePollHoursChange = (value) => {
        setPollLength(
            Object.assign(pollLength, {hours: value})
        )
    }

    const isFormNotValid = () => {
        if (question.validateStatus !== 'success') {
            return true;
        }

        for (let i = 0; i < choices.length; i++) {
            if (choices[i].validateStatus !== 'success') {
                return true;
            }
        }
    }

    const choiceViews = choices.map((choice, index) =>
        <PollChoice
            key={index}
            choice={choice}
            choiceNumber={index}
            removeChoice={removeChoice}
            handleChoiceChange={handleChoiceChange}
        />
    );

    return (
        <div className="new-poll-container">
            <h1 className="page-title">Create Poll</h1>
            <div className="new-poll-content">
                <Form onFinish={onFinish} className="create-poll-form">
                    <Form.Item
                        validateStatus={question.validateStatus}
                        help={question.errorMsg}
                        className="poll-form-row"
                    >
                        <TextArea
                            placeholder="Enter your question"
                            style={{fontSize: '16px'}}
                            className="question-text-area"
                            autoSize={{minRows: 3, maxRows: 6}}
                            name="question"
                            value={question.text}
                            onChange={handleQuestionChange}
                        />
                    </Form.Item>
                    {choiceViews}
                    <Form.Item className="poll-form-row">
                        <Button
                            type="dashed"
                            onClick={addChoice}
                            disabled={choices.length === MAX_CHOICES}
                        >
                            <PlusOutlined/> Add a choice
                        </Button>
                    </Form.Item>
                    <Form.Item className="poll-form-row">
                        <Row>
                            <Col xs={24} sm={4} style={{display: 'flex', alignItems: 'center'}}>
                                Poll length:
                            </Col>
                            <Col xs={24} sm={20}>
                            <span style={{marginRight: '18px'}}>
                                <Select
                                    name="days"
                                    defaultValue="1"
                                    onChange={handlePollDaysChange}
                                    style={{width: 60}}
                                >
                                    {
                                        Array.from(Array(8).keys()).map(i =>
                                            <Option key={i}>{i}</Option>
                                        )
                                    }
                                </Select> &nbsp;Days
                            </span>
                            <span>
                                <Select
                                    name="hours"
                                    defaultValue="0"
                                    onChange={handlePollHoursChange}
                                    style={{width: 60}}
                                >
                                    {
                                        Array.from(Array(24).keys()).map(i =>
                                            <Option key={i}>{i}</Option>
                                        )
                                    }
                                </Select> &nbsp;Hours
                            </span>
                            </Col>
                        </Row>
                    </Form.Item>
                    <Form.Item className="poll-form-row">
                        <Button
                            type="primary"
                            htmlType="submit"
                            size="large"
                            disabled={isFormNotValid()}
                            className="create-poll-form-button"
                        >
                            Create Poll
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

const PollChoice = ({choice, choiceNumber, removeChoice, handleChoiceChange}) => {
    return(
        <Form.Item
            validateStatus={choice.validateStatus}
            help={choice.errorMsg}
            className="poll-form-row"
        >
            <Input
                placeholder={'Choice ' + (choiceNumber + 1)}
                size="large"
                value={choice.text}
                className={choiceNumber > 1 ? "optional-choice" : null}
                onChange={(event) => handleChoiceChange(event, choiceNumber)}
            />
            {
                choiceNumber > 1 ?
                    <CloseOutlined
                        className="dynamic-delete-button"
                        disabled={choiceNumber <= 1}
                        onClick={() => removeChoice(choiceNumber)}
                    /> : null
            }
        </Form.Item>
    )
};

export default NewPoll;