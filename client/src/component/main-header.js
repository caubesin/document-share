import React from "react";
import Logo from "../assets/img/document-share.png";
import SearchBox from "./main-header/search-box";
import AccountMenu from "./main-header/account-menu";
import Divider from '@mui/material/Divider';
import './css/main-header.css';
import Modal from '@mui/material/Modal';
import { useSelector, useDispatch } from "react-redux";
import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import Skeleton from '@mui/material/Skeleton';
import { getUserData } from "../features/userSlice";
import { useNavigate } from "react-router-dom";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: 'none',
    boxShadow: 24,
    borderRadius: 1
  };
  
  const randomColor = () => "#" + Math.floor(Math.random()*16777215).toString(16);
  
  const ModalUser = ({handleClose, open}) => {
    const user_info = useSelector(state => state.user.user.user_info);
    
    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <div style={{display: 'flex', alignItems: "center", justifyContent: "space-between", padding: 5}}>
                    <h4 style={{paddingLeft: 10}}>Thông tin tài khoản</h4>
                    <IconButton aria-label="search-friend" onClick={handleClose}>
                        <CloseIcon />
                    </IconButton>
                </div>
                <Divider></Divider>
                {user_info ? 
                <div className="friend-info">
                    <div style={{width: "100%", display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
                        <Avatar sx={{backgroundColor: randomColor}}></Avatar>
                        <h4>{user_info.name}</h4>
                    </div>
                    <p>Thuộc tính</p>
                    <table className="friend-info__table">
                        <tbody>
                            <tr>
                                <td>ID</td>
                                <td>{user_info._id}</td>
                            </tr>
                            <tr>
                                <td>Sở hữu</td>
                                <td>{user_info.own_files.length}</td>
                            </tr>
                            <tr>
                                <td>Chia sẻ</td>
                                <td>{user_info.shared_files.length}</td>
                            </tr>
                            <tr>
                                <td>Bạn bè</td>
                                <td>{user_info.friend.accepted.length}</td>
                            </tr>
                        </tbody>
                    </table>
                </div> :
                <div className="friend-info">
                    <div style={{width: "100%", display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
                        <Skeleton variant="circular" width={40} height={40} />
                        <Skeleton variant="text" width="80%"/>
                    </div>
                    <Skeleton variant="text" width="20%"/>
                    <table className="friend-info__table">
                        <tbody>
                        <tr>
                            <td><Skeleton variant="text" width="80%"/></td>
                        </tr>
                        <tr>
                            <td><Skeleton variant="text" width="80%"/></td>
                        </tr>
                        <tr>
                            <td><Skeleton variant="text" width="80%"/></td>
                        </tr>
                        <tr>
                            <td><Skeleton variant="text" width="80%"/></td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                }
            </Box>
        </Modal>
    );
  }

const Header = () => {
    const [openModal, setOpenModal] = React.useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const handleOpenModal = async () => {
        dispatch(getUserData()).then((action) => {
            if(action.meta.requestStatus === "rejected") {
                navigate('/error')
            }
        });
        setOpenModal(true);
      }
    
      const handleCloseModal = () => {
        setOpenModal(false);
      }
    return(
        <>
            <div className="header">
                <div className="logo">
                    <img src={Logo} alt="Logo" />
                </div>
                <div className="search-box">
                    <SearchBox></SearchBox>         
                </div>
                <div className="user-info">
                    <AccountMenu handleOpenModal={handleOpenModal}></AccountMenu>
                    <ModalUser handleClose={handleCloseModal} open={openModal}></ModalUser>
                </div>
            </div>
            <Divider></Divider>
        </>
    )
}

export default Header;