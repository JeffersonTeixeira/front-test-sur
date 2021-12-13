import React from 'react'
import { Navigate } from 'react-router-dom'
import { isAuthenticated } from '../../services/auth';

const RequireAuth = ({ children }) => {

    if (isAuthenticated()) {
        return children;
    }
    return <Navigate to="/login" />



}

export default RequireAuth;
