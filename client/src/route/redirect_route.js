import React, {useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { setIsLoading} from "../features/authenticateSlice";
import Loading from '../component/loading';
import { sendReqToServer } from "../features/authenticateSlice";

const ReRoute = ({children}) => {
    const auth = useSelector((state) => state.authenticate.auth.isAuthenticated);
    const dispatch = useDispatch();
    const isLoading = useSelector(state => state.authenticate.isLoading)

    const sendReqLogin = async () => {
        const configReq = {
            method: 'get',
            url: '/',
            header: "Content-Type': 'text/plain; charset=utf-8",
            data: ""
        }

        dispatch(sendReqToServer(configReq));
    }

    useEffect(() => {
        sendReqLogin()
    }, []);
    return (
        auth ? <Navigate to="/document"/> : children
    )
}

export default ReRoute;