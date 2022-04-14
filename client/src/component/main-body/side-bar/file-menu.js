import React, { useRef, useState } from "react";
import { styled, alpha } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import InputBase from '@mui/material/InputBase';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import AddIcon from '@mui/icons-material/Add';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { upLoadFile, getFile, createFolder } from "../../../features/fileSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useSnackbar } from 'notistack';
import sendReq from "../../../helper/sendReqToServer";
import ListUpLoad from "./list-upload";


const Input = styled('input')({
  display: 'none',
});

const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color:
      theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      '&:active': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity,
        ),
      },
    },
  },
}));

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: 1,
  boxShadow: 24
};

export default function Menus() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const path = useSelector(state => state.current.path);
  const limit = useSelector(state => state.file.limit);
  const page = useSelector(state => state.current.page);
  const { enqueueSnackbar } = useSnackbar();
  const [openModal, setOpenModal] = React.useState(false);
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [disabledUpload, setDisabledUpload] = useState(false);
  const [fileUpload, setFileUpload] = useState({
    name: null,
    progress: null
  });
  const [folderName, setFolderName] = useState("");
  var ctrl = useRef(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const cancelUploadFile = () => {
    if(fileUpload.progress === 100) return;
    enqueueSnackbar("Đã hủy tải lên", {variant: "error"})
    setDisabledUpload(false);
    return ctrl.current && ctrl.current.abort()
  };

  const handleChange = async (e) => {
    handleClose()
    const data = new FormData();
    const fileList = e.target.files;

    setDisabledUpload(true)
    Object.values(fileList).forEach(file => {
      
      data.append("parent", params.path ? params.path : "/")
      data.append('file', file, file.name);
      
    })

    if(e.target.files.length === 1) {
        ctrl.current = new AbortController()
        const configReq = {
          method: 'post',
          url: `/file/upload/single`,
          header: {},
          data: data,
          signal: ctrl.current.signal,
          onUploadProgress: (data) => {
            
            let upFile = fileList[0];
            upFile = {
              name: upFile.name,
              progress: Math.round((100 * data.loaded) / data.total)
            }
            setFileUpload(upFile)
          }
        }
        await sendReq(configReq).then((res) => {
          if(res.status === 200) {
            setDisabledUpload(false)
            if(res.data.isAuthenticated === false) {
              navigate('/signin')
            }
            else {
              enqueueSnackbar(res.data.message.mess, {variant: res.data.message.type})
            }
          }
          else {
            navigate('/error')
          }
        })
        
      }
    else {
      const configReq = {
        method: 'post',
          url: `/file/upload/multiple`,
          header: {},
          data: data,
          onUploadProgress: (data) => {
            let upFile = fileList[0];
            const fileLenght = fileList.length;
            upFile = {
              name: upFile.name + `,...(${fileLenght})`,
              progress: Math.round((100 * data.loaded) / data.total)
            }
            setFileUpload(upFile)
          }
      }
      await sendReq(configReq).then((res) => {
        if(res.status === 200) {
          setDisabledUpload(false)
          if(res.data.isAuthenticated === false) {
            navigate('/signin')
          }
          else {
            enqueueSnackbar(res.data.message.mess, {variant: res.data.message.type})
          }
        }
        else {
          navigate('/error')
        }
      })
    }
    dispatch(getFile({type: "own", path: params.path ? params.path : "/", page: page, limit: limit})).then((action) => {
      if(action.meta.requestStatus === "rejected") {
        navigate('/error')
      }
      else if(action.payload.isAuthenticated === false) {
        navigate('/signin')
      }
    })
  }

  const creFolder = async (e) => {
    e.preventDefault();
    await dispatch(createFolder({name: folderName, path: params.path ? params.path : "/"})).then((action) => {
      if(action.meta.requestStatus === "rejected") {
        navigate('/error')
      }
      else if(action.payload.isAuthenticated === false) {
        navigate('/signin')
      }
      else {
        enqueueSnackbar(action.payload.message.mess, {variant: action.payload.message.type})
      }
    });
    await dispatch(getFile({type: "own", path: params.path ? params.path : "/", page: page, limit: limit})).then((action) => {
      if(action.meta.requestStatus === "rejected") {
        navigate('/error')
      }
      else if(action.payload.isAuthenticated === false) {
        navigate('/signin')
      }
    });
    setOpenModal(false);
  }

  return (
    <div>
      <Button
        id="demo-customized-button"
        aria-controls={open ? 'demo-customized-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        variant="contained"
        disableElevation
        onClick={handleClick}
        startIcon={<AddIcon />}
        sx = {{margin: 2}}
        disabled= {disabledUpload}
      >
        Thêm
      </Button>
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
        <div style={{display: 'flex', alignItems: "center", justifyContent: "space-between", padding: 5}}>
                    <h4 style={{paddingLeft: 10}}>Tạo thư mục mới</h4>
                    <IconButton aria-label="search-friend" onClick={handleCloseModal}>
                        <CloseIcon />
                    </IconButton>
          </div>
          <Divider></Divider>
          <form onSubmit={creFolder}>
            <div>   
                <IconButton sx={{ p: '10px' }} aria-label="menu">
                    <CreateNewFolderIcon />
                </IconButton>
                <InputBase onChange={(e) => setFolderName(e.currentTarget.value)}
                    sx={{ ml: 1, flex: 1, borderBottom: 1, width: "80%"}}
                    placeholder="Nhập tên thư mục"
                    inputProps={{ 'aria-label': 'Tên thư mục' }}
                    autoFocus={true}
                    
                />
              </div>
            <div style={{display: "flex", justifyContent: "flex-end", alignItems: "center", margin: 10}}>
              <Button variant="outlined" type='button' onClick={handleCloseModal}>Hủy</Button>
              <Button variant="contained" type='submit'>Tạo</Button>
            </div>
          </form>
        </Box>
      </Modal>
      <StyledMenu
        id="demo-customized-menu"
        MenuListProps={{
          'aria-labelledby': 'demo-customized-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={() => {handleClose(); handleOpenModal()}} disableRipple>
          <CreateNewFolderIcon />
          Tạo thư mục
        </MenuItem>
        <Divider sx={{ my: 0.5 }} />
        <MenuItem disableRipple>
          <label htmlFor="icon-button-file">
            <Input accept="*" id="icon-button-file" type="file" name="file" onChange={handleChange} multiple/>
            <UploadFileIcon />
            Tải lên tệp tin
          </label>
        </MenuItem>
        {/*<MenuItem disableRipple>
          <label htmlFor="icon-button-folder">
            <input type="file" id="icon-button-folder" name="file"  onChange={handleChange} webkitdirectory='true' multiple/>
            <DriveFolderUploadIcon />
            Tải lên thư mục
          </label>
      </MenuItem>*/}
      </StyledMenu>
      <ListUpLoad fileUpload={fileUpload} cancelUploadFile={cancelUploadFile}></ListUpLoad>
    </div>
  );
}