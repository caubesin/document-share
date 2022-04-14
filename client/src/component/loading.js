import React from "react";
import CircularProgress from '@mui/material/CircularProgress';

const Loading = () => {
    return(
        <div style={{width: "100%", height: "auto", display: "flex", justifyContent: "center", alignItems: "center", marginTop: "3rem"}}>
            <CircularProgress />
        </div>
    )
}

export default Loading;