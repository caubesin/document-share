import React from "react";
import DocumentHeader from "./document/document-header";
import DocumentBody from "./document/document-body";
import { useSelector } from "react-redux";
import FriendInfo from "./document/friend-info";

const Document = () => {
    const tabs = useSelector(state => state.current.tabs);
    if(tabs === 2) {
        return(
            <div className="document">
                <FriendInfo></FriendInfo>
            </div>
        )
    }

    return(
        <>
            <div className="document">
                <DocumentHeader></DocumentHeader>
                <DocumentBody></DocumentBody>
            </div>
        </>
        
    )
}

export default Document;