import React, {useEffect, useRef, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {notification, Pagination} from "antd";
import '../styles/PollList.css';
import PollService from "../API/PollService";
import Poll from "../components/Poll";
import Loader from "../components/UI/loader/Loader";
import {POLL_LIST_SIZE} from "../constants/Constants";

const PollList = ({isAuthenticated, onLogout, ...props}) => {
    const [polls, setPolls] = useState([]);
    const [page, setPage] = useState(0);
    const size = useRef(POLL_LIST_SIZE);
    const [totalElements, setTotalElements] = useState(0);
    const [currentVotes, setCurrentVotes] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const loadPollList = () => {
            let promise;
            if (props.username) {
                if(props.type === 'USER_CREATED_POLLS') {
                    promise = PollService.getUserCreatedPolls(props.username, page, size.current);
                } else if (props.type === 'USER_VOTED_POLLS') {
                    promise = PollService.getUserVotedPolls(props.username, page, size.current);
                }
            } else {
                promise = PollService.getAllPolls(page, size.current);
            }

            if (!promise) {
                return;
            }

            setIsLoading(true);

            promise
                .then(response => {
                    setPolls(response.content);
                    setTotalElements(response.totalElements);
                    setCurrentVotes(Array(response.length).fill(null));
                }).finally(() => {
                    setIsLoading(false);
            })
        }

        loadPollList();
    }, [page, props.type, props.username]);

    const handleVoteChange = (event, pollIndex) => {
        setCurrentVotes([
            ...currentVotes.slice(0, pollIndex),
            event.target.value,
            ...currentVotes.slice(pollIndex + 1)
        ])
    }

    const handleVoteSubmit = (event, pollIndex) => {
        event.preventDefault();
        if (!isAuthenticated) {
            navigate("/login");
            notification.info({
                message: 'Polling App',
                description: "Please login to vote."
            });
            return;
        }

        const poll = polls[pollIndex];
        const selectedChoice = currentVotes[pollIndex];

        const voteData = {
            pollId: poll.id,
            choiceId: selectedChoice
        };

        PollService.castVote(voteData)
            .then(response => {
                setPolls([
                    ...polls.slice(0, pollIndex),
                    response,
                    ...polls.slice(pollIndex + 1)
                ]);
            }).catch(error => {
            if(error.response.status === 401) {
                onLogout('/login', 'error', 'You have been logged out. Please login to vote');
            } else {
                notification.error({
                    message: 'Polling App',
                    description: error.message || 'Sorry! Something went wrong. Please try again!'
                });
            }
        });
    }

    const pollViews = [
        polls.map((poll, pollIndex) => {
            return(
                <Poll
                    key={poll.id}
                    poll={poll}
                    currentVote={currentVotes[pollIndex]}
                    handleVoteChange={(event) => handleVoteChange(event, pollIndex)}
                    handleVoteSubmit={(event) => handleVoteSubmit(event, pollIndex)}
                />
            )
        })
    ];

    const handlePageChange = (page) => {
        setPage(page - 1);
    }

    if (isLoading) {
        return <Loader/>;
    }

    if (polls.length === 0) {
        return (
            <div className="no-polls-found">
                <span>No Polls Found.</span>
            </div>
        );
    }

    return (
        <div className="polls-container">
            {pollViews}
            <div className="pagination">
                <Pagination
                    current={page + 1}
                    defaultPageSize={size.current}
                    total={totalElements}
                    onChange={handlePageChange}
                    hideOnSinglePage={true}
                    size="small"
                />
            </div>
        </div>
    );
};

export default PollList;