import React from 'react';
import {Navigate} from "react-router-dom";

const PrivateRoute = ({isAuthenticated, children, redirectPath='/login'}) => {
    if (!isAuthenticated) {
        return <Navigate to={redirectPath} replace/>;
    }

    return children;
};

export default PrivateRoute;