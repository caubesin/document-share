import React, {useEffect} from "react";
import Friend from "./friend";
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import { useSelector, useDispatch } from "react-redux";
import { setIsShowInfo } from '../../../features/currentSlice';
import CloseIcon from '@mui/icons-material/Close';

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
      flexGrow: 1,
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      marginRight: -drawerWidth,
      ...(open && {
        transition: theme.transitions.create('margin', {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
        marginRight: 0,
      }),
    }),
);
  
const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'space-between',
}))

const drawerWidth = 350;
let randomColor;

const FriendInfo = () => {
    const dispatch = useDispatch();
    const open = useSelector(state => state.current.isShowInfo);
    const currentFriend = useSelector(state => state.current.friend);
    const handleDrawerClose = () => {
      dispatch(setIsShowInfo())
    };
    useEffect(() => {
      randomColor = "#" + Math.floor(Math.random()*16777215).toString(16);
    }, [currentFriend])
    return (
      <Box sx={{ display: 'flex' }}>
        <Main open={open}>
          <Friend></Friend>
        </Main>
        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              position: 'relative'
            },
          }}
          variant="persistent"
          anchor="right"
          open={open}
        >
          <DrawerHeader>
            <div className="friend">Thông tin bạn bè</div>
            <IconButton onClick={handleDrawerClose}>
              <CloseIcon></CloseIcon>
            </IconButton>
          </DrawerHeader>
          <Divider />
          {currentFriend._id ?
            <div className="friend-info">
                <div style={{width: "100%", display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
                    <Avatar sx={{backgroundColor: randomColor}}></Avatar>
                    <h4>{currentFriend.name}</h4>
                </div>
                <p>Thuộc tính</p>
                <table className="friend-info__table">
                    <tbody>
                    <tr>
                        <td>ID</td>
                        <td>{currentFriend._id}</td>
                    </tr>
                    <tr>
                        <td>Sở hữu</td>
                        <td>{currentFriend.own_files.length}</td>
                    </tr>
                    <tr>
                        <td>Chia sẻ</td>
                        <td>{currentFriend.shared_files.length}</td>
                    </tr>
                    <tr>
                        <td>Bạn bè</td>
                        <td>{currentFriend.friend.accepted.length}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
            :
            <div style={{color: "#555", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", marginTop: "2rem"}}>
              <svg width="107px" height="82px" viewBox="0 0 107 82" focusable="false"><path fill="#C0C0C0" d="M0,4a4,4,0,0,1,4,-4h89a4,4,0,0,1,4,4v18.5l-23.5,40.5h-69.5a4,4,0,0,1,-4,-4ZM74.5,65l23,-39.15l1,0l7,4.1l1,1l-23,39.15ZM74,65.8l9.5,5.5l-9,4ZM97,51v8a4,4,0,0,1,-4,4h-3ZM21,63v19l23,-19Z"></path></svg>
              Chọn một bạn bè để xem chi tiết
            </div>
          }
        </Drawer>
      </Box>
    )
}

export default FriendInfo;