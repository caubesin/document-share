import React, {useEffect} from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "./loading";
import sendReq from "../helper/sendReqToServer";

const ShareLink = () => {
    const navigate = useNavigate();
    const params = useParams();
    
    useEffect(() => {
        const configReq = {
            method: 'post',
            url: '/file/share-link',
            header: {
                "Content-Type": "text/plain"
            },
            params: {
                link: params.link,
            }
        }
        sendReq(configReq).then((res) => {
            console.log(res)
            if(res.status === 200) {
                navigate('/main');
            }
            else {
                navigate('/error')
            }
        })
    }, [])
    return <Loading></Loading>
}

export default ShareLink;