import React from "react";
import Menu from './side-bar/file-menu';
import ListCtrl from "./side-bar/list-ctrl";
import { setFile, setFriend } from "../../features/currentSlice";
import { useDispatch } from "react-redux";

const SideBar = () => {
    const [open, setOpen] = React.useState(false);
    const dispatch = useDispatch();
    const handleClick = () => {
        setOpen(true);
    };
    
    const handleClickSideBar = () => {
        dispatch(setFile({
            _id: null
        }))
        dispatch(setFriend({
            _id: null
        }))
    }
    return(
        <div className="side-bar" onClick={handleClickSideBar}>
            <Menu handleClick={handleClick}></Menu>
            <ListCtrl></ListCtrl>
        </div>
    )
}

export default SideBar;