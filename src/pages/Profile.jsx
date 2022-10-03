import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import {Avatar, Tabs} from "antd";
import '../styles/Profile.css';
import PollService from "../API/PollService";
import PollList from "./PollList";
import NotFound from "./NotFound";
import ServerError from "./ServerError";
import Loader from "../components/UI/loader/Loader";
import {getAvatarColor} from "../utils/Colors";
import {formatDate} from "../utils/Helpers";

const Profile = () => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [notFound, setNotFound] = useState(false);
    const [serverError, setServerError] = useState(false);
    const {username} = useParams();

    const loadUserProfile = (username) => {
        setIsLoading(true);
        
        PollService.getUserProfile(username)
            .then(response => {
                setUser(response);
            }).catch(error => {
                if (error.response.status === 404) {
                    setNotFound(true);
                } else {
                    setServerError(true);
                }
        });

        setIsLoading(false);
    }

    useEffect(() => {
        loadUserProfile(username)
    }, [username])

    if (isLoading) {
        return <Loader/>
    }

    if (notFound) {
        return <NotFound/>
    }

    if (serverError) {
        return <ServerError/>
    }

    return (
        <div className="profile">
            {
                user ? (
                    <div className="user-profile">
                        <div className="user-details">
                            <div className="user-avatar">
                                <Avatar className="user-avatar-circle" style={{backgroundColor: getAvatarColor(user.name)}}>
                                    {user.name.toUpperCase()}
                                </Avatar>
                            </div>
                            <div className="user-summary">
                                <div className="full-name">{user.name}</div>
                                <div className="username">@{user.username}</div>
                                <div className="user-joined">
                                    Joined {formatDate(user.joinedAt)}
                                </div>
                            </div>
                        </div>
                        <div className="user-poll-details">
                            <Tabs defaultActiveKey="1"
                                  centered
                                  animated={false}
                                  tabBarStyle={{textAlign: 'center'}}
                                  size="large"
                                  className="profile-tabs">
                                <Tabs.TabPane tab={`${user.pollCount} Polls`} key="1">
                                    <PollList username={username} type="USER_CREATED_POLLS"/>
                                </Tabs.TabPane>
                                <Tabs.TabPane tab={`${user.voteCount} Votes`}  key="2">
                                    <PollList username={username} type="USER_VOTED_POLLS"/>
                                </Tabs.TabPane>
                            </Tabs>
                        </div>
                    </div>
                ) : null
            }
        </div>
    );
};

export default Profile;