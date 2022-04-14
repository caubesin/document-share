import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

const PrivateRoute = ({children}) => {
    const auth = useSelector(state => state.authenticate.auth.isAuthenticated);
    const location = useLocation();
    if(auth) {
        return children;
    }
    else {
        let path = location.pathname.replaceAll("/", "%2F");
        path = path.replace("%2F", "/");
        return(<Navigate to={`/signin${path}`} />)
    }
}

export default PrivateRoute;