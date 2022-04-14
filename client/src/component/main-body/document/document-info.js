import React, {useEffect} from "react";
import DocumentTable from "./document-table";
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import IconButton from '@mui/material/IconButton';
import Tooltip from "@mui/material/Tooltip";
import { useSelector, useDispatch } from "react-redux";
import { setIsShowInfo } from '../../../features/currentSlice';
import CloseIcon from '@mui/icons-material/Close';
import FileCustomIcon from "../../react-file-icon/file-icon";
import FolderIcon from '../../../assets/img/folder.svg';

import moment from "moment";

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
const randomColor = "#" + Math.floor(Math.random()*16777215).toString(16);

const DocumentInfo = () => {
    const dispatch = useDispatch();
    const open = useSelector(state => state.current.isShowInfo);
    const currentFile = useSelector(state => state.current.file);
    const handleDrawerClose = () => {
      dispatch(setIsShowInfo())
    };
    
    return (
      <Box sx={{ display: 'flex' }}>
        <Main open={open}>
          <DocumentTable></DocumentTable>
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
            {currentFile._id ? <div className="file-name">{ currentFile.metadata.isDir ?
                  <div className="file-name">
                    <div className="icon" style={{display: "flex", justifyContent: 'center', alignItems: 'center'}}>
                      <img src={FolderIcon} style={{width: '100%'}} alt="folder"/>
                    </div>
                    {currentFile.name}
                  </div>
                  :<FileCustomIcon ext={currentFile.metadata.ext}></FileCustomIcon>} {currentFile.metadata.originalname}</div> : <div className="file-name">Thông tin chi tiết</div>}
            <IconButton onClick={handleDrawerClose}>
              <CloseIcon></CloseIcon>
            </IconButton>
          </DrawerHeader>
          <Divider />
          {currentFile._id ?
            <div className="file-info">
              <p>Người có quyền truy cập</p>
              <div className="access-name">
                <Tooltip title={currentFile.metadata.own.name + " là chủ sở hữu"}><Avatar sx={{ textTransform: "uppercase", backgroundColor: randomColor }}></Avatar></Tooltip>
                <Divider orientation="vertical" variant="middle" flexItem sx={{marginLeft: 1, marginRight: 1}}/>
                <AvatarGroup max={4}>
                  {currentFile.metadata.shared.map((name) => {
                    return <Tooltip title={name + " được chia sẻ"}><Avatar key={name} sx={{ textTransform: "uppercase", backgroundColor: randomColor }}>{name.charAt(0)}</Avatar></Tooltip>
                  })}
                </AvatarGroup>
              </div>
              <p>Thuộc tính</p>
              <table className="file-info__table">
                <tbody>
                  <tr>
                    <td>Loại</td>
                    <td>{currentFile.metadata.ext ? currentFile.metadata.ext : "Thư mục"}</td>
                  </tr>
                  <tr>
                    <td>Kích thước</td>
                    <td>{Math.round(currentFile.length/1024) > 1  ? Math.round(currentFile.length/1024) + ' KB' : '-'}</td>
                  </tr>
                  <tr>
                    <td>Chủ sở hữu</td>
                    <td>{currentFile.metadata.own.name}</td>
                  </tr>
                  <tr>
                    <td>Thời gian tải lên</td>
                    <td>{moment(currentFile.uploadDate).utc().format("MMM Do, YYYY")}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            :
            <div style={{color: "#555", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", marginTop: "2rem"}}>
              <svg width="107px" height="82px" viewBox="0 0 107 82" focusable="false"><path fill="#C0C0C0" d="M0,4a4,4,0,0,1,4,-4h89a4,4,0,0,1,4,4v18.5l-23.5,40.5h-69.5a4,4,0,0,1,-4,-4ZM74.5,65l23,-39.15l1,0l7,4.1l1,1l-23,39.15ZM74,65.8l9.5,5.5l-9,4ZM97,51v8a4,4,0,0,1,-4,4h-3ZM21,63v19l23,-19Z"></path></svg>
              Chọn một tệp hoặc thư mục để xem chi tiết
            </div>
          }
        </Drawer>
      </Box>
    )
}

export default DocumentInfo;