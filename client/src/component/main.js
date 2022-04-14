import React from "react";
import Header from './main-header';
import Body from './main-body';
import './css/main.css';

const Document = () => {
    return(
        <div className="main">
            <Header></Header>
            <Body></Body>
        </div>
    )
}

export default Document;