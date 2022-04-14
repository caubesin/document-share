import React from "react";
import SideBar from './main-body/side-bar';
import Document from "./main-body/document";
import './css/main-body.css';

const Body = () => {
    return(
        <div className="body">
            <SideBar></SideBar>
            <Document></Document>
        </div>
    )
}

export default Body;