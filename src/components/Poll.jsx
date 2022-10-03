import React from 'react';
import {Link} from "react-router-dom";
import {Avatar, Button, Radio} from "antd";
import {CheckCircleOutlined} from "@ant-design/icons";
import './Poll.css';
import {getAvatarColor} from "../utils/Colors";
import {formatDateTime} from "../utils/Helpers";

const Poll = (props) => {
    const isSelected = (choice) => {
        return props.poll.selectedChoice === choice.id;
    }

    const calculatePercentage = (choice) => {
        if (props.poll.totalVotes === 0) {
            return 0;
        }
        return (choice.voteCount*100)/(props.poll.totalVotes);
    }

    const getWinningChoice = () => {
        return props.poll.choices.reduce((prevChoice, currentChoice) =>
                currentChoice.voteCount > prevChoice.voteCount ? currentChoice : prevChoice,
            {voteCount: -Infinity}
        );
    }

    const getTimeRemaining = (poll) => {
        const expirationTime = new Date(poll.expirationDateTime).getTime();
        const currentTime = new Date().getTime();

        const difference_ms = expirationTime - currentTime;
        const seconds = Math.floor((difference_ms / 1000) % 60);
        const minutes = Math.floor((difference_ms / 1000 / 60) % 60);
        const hours = Math.floor((difference_ms / (1000 * 60 * 60)) % 24);
        const days = Math.floor(difference_ms / (1000 * 60 * 60 * 24));

        let timeRemaining;

        if(days > 0) {
            timeRemaining = days + " days left";
        } else if (hours > 0) {
            timeRemaining = hours + " hours left";
        } else if (minutes > 0) {
            timeRemaining = minutes + " minutes left";
        } else if(seconds > 0) {
            timeRemaining = seconds + " seconds left";
        } else {
            timeRemaining = "less than a second left";
        }

        return timeRemaining;
    }

    const pollChoices = [];
    if (props.poll.selectedChoice || props.poll.isExpired) {
        const winningChoice = props.poll.isExpired ? getWinningChoice() : null;

        props.poll.choices.forEach(choice => {
            pollChoices.push(
                <CompletedOrVotedPollChoice
                    key={choice.id}
                    choice={choice}
                    isWinner={winningChoice && choice.id === winningChoice.id}
                    isSelected={isSelected(choice)}
                    percentVote={calculatePercentage(choice)}
                />
            );
        })
    } else {
        props.poll.choices.forEach(choice => {
            pollChoices.push(
                <Radio className="poll-choice-radio" key={choice.id} value={choice.id}>
                    {choice.text}
                </Radio>
            )
        })
    }

    return (
        <div className="poll-content">
            <div className="poll-header">
                <div className="poll-creator-info">
                    <Link className="creator-link" to={`/users/${props.poll.createdBy.username}`}>
                        <Avatar className="poll-creator-avatar"
                                style={{backgroundColor: getAvatarColor(props.poll.createdBy.name)}}>
                            {props.poll.createdBy.name[0].toUpperCase()}
                        </Avatar>
                        <span className="poll-creator-name">
                            {props.poll.createdBy.name}
                        </span>
                        <span className="poll-creator-username">
                            @{props.poll.createdBy.username}
                        </span>
                        <span className="poll-creation-date">
                            {formatDateTime(props.poll.creationDateTime)}
                        </span>
                    </Link>
                </div>
                <div className="poll-question">
                    {props.poll.question}
                </div>
            </div>
            <div className="poll-choices">
                <Radio.Group
                    className="poll-choice-radio-group"
                    onChange={props.handleVoteChange}
                    value={props.currentVote}>
                    {pollChoices}
                </Radio.Group>
            </div>
            <div className="poll-footer">
                {
                    !(props.poll.selectedChoice || props.poll.isExpired) ?
                        <Button
                            className="vote-button"
                            disabled={!props.currentVote}
                            onClick={props.handleVoteSubmit}>
                            Vote
                        </Button> : null
                }
                <span className="total-votes">{props.poll.totalVotes} votes</span>
                <span className="separator">•</span>
                <span className="time-left">
                        {
                            props.poll.isExpired ? "Final results" : getTimeRemaining(props.poll)
                        }
                </span>
            </div>
        </div>
    );
};

const CompletedOrVotedPollChoice = ({choice, isWinner, isSelected, percentVote}) => {
    return(
        <div className="cv-poll-choice">
            <span className="cv-poll-choice-details">
                <span className="cv-choice-percentage">
                    {Math.round(percentVote * 100) / 100}%
                </span>
                <span className="cv-choice-text">
                    {choice.text}
                </span>
                {
                    isSelected ? <CheckCircleOutlined className="selected-choice-icon"/> : null
                }
            </span>
            <span className={isWinner ? 'cv-choice-percent-chart winner': 'cv-choice-percent-chart'}
                  style={{width: percentVote + '%' }}>
            </span>
        </div>
    );
};

export default Poll;