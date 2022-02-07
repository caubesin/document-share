import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({children}) => {
    //const auth = useSelector(state => state.authenticate.auth.isAuthenticated);
    const auth = true;
    return(auth ? children : <Navigate to="/signin"/>)
}

export default PrivateRoute;