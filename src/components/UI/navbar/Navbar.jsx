import React, {useEffect, useState} from 'react';
import {Link, useNavigate} from "react-router-dom";
import {Layout, Menu} from "antd";
import {BarChartOutlined, HomeOutlined, LoginOutlined, UserAddOutlined, UserOutlined} from "@ant-design/icons";
import './Navbar.css';

const {Header} = Layout;

const Navbar = ({isAuthenticated, currentUser, onLogout}) => {
    const path = window.location.pathname;
    const [current, setCurrent] = useState(path);
    const [menuItems, setMenuItems] = useState([]);
    const navigate = useNavigate();
    
    useEffect(() => {
        if (isAuthenticated) {
            setMenuItems([
                {key: '/', icon: <HomeOutlined/>, className: 'menu-icon-item'},
                {key: '/poll/new', icon: <BarChartOutlined/>, className: 'menu-icon-item'},
                {key: '/profile', icon: <UserOutlined/>, className: 'menu-icon-item',
                    children: [
                        {label: currentUser.name, className: 'profile-dropdown-menu user-full-name-info'},
                        {label: '@' + currentUser.username, className: 'profile-dropdown-menu username-info'},
                        {type: 'divider'},
                        {label: 'Profile', key: `/users/${currentUser.username}`, className: 'profile-dropdown-menu'},
                        {label: 'Logout', key: 'logout', className: 'profile-dropdown-menu'}
                    ]
                }
            ]);
        } else {
            setMenuItems([
                {label: 'Login', key: '/login', icon: <LoginOutlined/>},
                {label: 'Signup', key: '/signup', icon: <UserAddOutlined/>}
            ]);
        }
    }, [currentUser, isAuthenticated]);

    useEffect(() => {
        setCurrent(path);
    }, [path]);

    const onClick = (item) => {
        item.key === 'logout' ? onLogout() : navigate(item.key);
    }

    return(
        <Header className="navbar">
            <div className="container">
                <div className="title">
                    <Link to="/" onClick={() => setCurrent('/')}>Polling App</Link>
                </div>
                <Menu
                    className="menu"
                    onClick={onClick}
                    selectedKeys={current}
                    disabledOverflow={true}
                    triggerSubMenuAction={'click'}
                    mode="horizontal"
                    style={{lineHeight: '64px'}}
                    items={menuItems}
                />
            </div>
        </Header>
    );
};

export default Navbar;