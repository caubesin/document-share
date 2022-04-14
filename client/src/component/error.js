import React from "react";
import Error_500 from "../assets/img/drible.gif";
import Error_404_Img from "../assets/img/error_404.gif";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Error = ({status}) =>{
    const navigate = useNavigate()
    if(status === 404) {
        return(
            <div style={{
                width: "100vw",
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: 'column'
            }}>
                <img style={{objectFit: "cover"}} src={Error_404_Img} alt="404" />
                <h1 style={{margin: 10}}>Không tìm thấy trang</h1>
                <Button variant="contained" onClick={() => navigate("/main")}>Trở về trang chủ</Button>
            </div>
        )
    }
    else {
        return(
            <div style={{
                width: "100vw",
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column"
            }}>
                <img style={{objectFit: "cover"}} src={Error_500} alt="Error" />
                <h1 style={{margin: 10}}>Lỗi không xác định</h1>
                <Button variant="contained" onClick={() => navigate("/main")}>Trở về trang chủ</Button>
            </div>
        )
    }
}

export default Error;