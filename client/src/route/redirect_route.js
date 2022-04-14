import React, {useEffect,useState} from "react";
import { useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { sendReqReLogin } from "../features/authenticateSlice";
import Loading from "../component/loading";

const ReRoute = ({children}) => {
    const params = useParams();
    const [renderEl,  setRenderEl] = useState(<Loading></Loading>);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    useEffect(() => {
        dispatch(sendReqReLogin()).then((action) => {
            if(action.meta.requestStatus === "rejected") {
                navigate('/error')
            }
            else if(action.payload.isAuthenticated) {
                navigate(`/${params.path ? params.path : "main"}`)
            }
            else {
                setRenderEl(children);
            }
        });
    },[])
    return (
        <>
            {renderEl}
        </>
    )
}

export default ReRoute;