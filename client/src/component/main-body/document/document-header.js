import React, { useState, useEffect } from "react";
import Divider from "@mui/material/Divider";
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import LinkIcon from '@mui/icons-material/Link';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import CloseIcon from '@mui/icons-material/Close';
import DownloadIcon from '@mui/icons-material/Download';
import InfoIcon from '@mui/icons-material/Info';
import {useDispatch, useSelector} from 'react-redux';
import {setFile, setIsShowInfo} from '../../../features/currentSlice';
import { downLoadFile } from "../../../features/fileSlice";
import Link from '@mui/material/Link';
import {Modal, Box, Button} from "@mui/material";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Checkbox from '@mui/material/Checkbox';
import ListItemIcon from '@mui/material/ListItemIcon';
import InputBase from '@mui/material/InputBase';
import { getFriend } from "../../../features/userSlice";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../../loading";
import InfiniteScroll from "react-infinite-scroll-component";
import qs from 'qs'
import { getFile } from "../../../features/fileSlice";
import { useSnackbar } from 'notistack';
import sendReq from '../../../helper/sendReqToServer';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    borderRadius: 1,
    boxShadow: 24,
    overflow: "hidden"
};

const ShareModal  = ({handleCloseShareModal, openShareModal, file}) => {
    const selectedFile = useSelector(state => state.current.file);
    const friend = useSelector(state => state.user.friend.friend);
    const navigate = useNavigate();
    const [checked, setChecked] = React.useState([]);
    const [hasMore, setHasMore] = React.useState(true)
    const [items, setItems] = React.useState(friend);
    const [page, setPage] = React.useState(1);
    const { enqueueSnackbar } = useSnackbar();
    
    const handleToggle = (value) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        const arrayId = checked.map((user) => {
            return user._id;
        })
        const data = qs.stringify({
            "userId": `${JSON.stringify(arrayId)}`,
            "fileId": `${selectedFile._id}`
        })
        
        const configReq = {
            method: 'post',
            url: '/file/share',
            header: {
                "Content-Type": 'application/x-www-form-urlencoded;charset=utf-8'
            },
            data: data
        }
        sendReq(configReq).then((res) => {
            if(res.status === 200) {
                if(res.data.isAuthenticated === false) {
                    navigate('/signin')
                }
                else {
                    handleCloseShareModal();
                    enqueueSnackbar(res.data.message.mess, {variant: res.data.message.type})
                }
            }
            else {
                navigate('/error')
            }
        })
    }

    const loadFriend = async () => {
        const configReq = {
            method: 'get',
                url: '/user/friend',
                header: {
                    "Content-Type": "text/plain"
                },
                params: {
                    type: "friend",
                    page: page
                }
        }
        sendReq(configReq).then((res) => {
            if(res.status === 200) {
                if(res.data.isAuthenticated === false) {
                    navigate('/signin')
                }
                else {
                    setItems(items.concat(res.data));
                    setPage(page + 1) 
                }
            }
            else if(res.data[0] === "END") {
                setHasMore(false);
            }
            else {
                navigate('/error')
            }
        })
    }
    useEffect(() => {
        setChecked([])
    }, [selectedFile])

    return(
        <Modal
            open={openShareModal}
            onClose={handleCloseShareModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            >
            <Box sx={style}>
            <div style={{display: 'flex', alignItems: "center", justifyContent: "space-between", padding: 5}}>
                        <h4 style={{paddingLeft: 10}}>Chia sẻ</h4>
                        <IconButton aria-label="search-friend" onClick={handleCloseShareModal}>
                            <CloseIcon />
                        </IconButton>
                </div>
                <Divider></Divider>
                {/*file._id && <div className="file-name">{ file.metadata.isDir ?
                    <div className="file-name">
                        <div className="icon" style={{display: "flex", justifyContent: 'center', alignItems: 'center'}}>
                        <img src={FolderIcon} style={{width: '100%'}} alt="folder"/>
                        </div>
                        {file.name}
                    </div>
                    :<FileCustomIcon ext={file.metadata.ext}></FileCustomIcon>} {file.metadata.originalname}
                </div>*/}
                <form onSubmit={handleSubmit}>
                    <List dense sx={{ width: '100%', bgcolor: 'background.paper' }}>
                        <div id="scrollableDiv" style={{height: "100%", overflow:"auto"}}>
                            {items.length === 0 ? "" :
                            <InfiniteScroll
                                dataLength={items.length}
                                next={loadFriend}
                                hasMore={hasMore}
                                loader={<Loading></Loading>}
                                height={300}
                                scrollableTarget="scrollableDiv"
                            >
                            {items.map((value) => {
                                if(value === "END") return "";
                                const labelId = `checkbox-list-secondary-label-${value._id}`;
                                return(
                                    <ListItem
                                    key={value._id}
                                    value={value._id}
                                    disablePadding
                                    >
                                        <ListItemButton role={undefined} onClick={handleToggle(value)} dense>
                                            <ListItemIcon>
                                                <Checkbox
                                                edge="start"
                                                checked={checked.indexOf(value) !== -1}
                                                tabIndex={0}
                                                disableRipple
                                                inputProps={{ 'aria-labelledby': labelId }}
                                                />
                                            </ListItemIcon>
                                        <ListItemAvatar>
                                            <Avatar></Avatar>
                                        </ListItemAvatar>
                                        <ListItemText id={labelId} primary={value.name} />
                                        </ListItemButton>
                                    </ListItem>
                                );
                            })}
                        </InfiniteScroll>}
                        </div>
                    </List>
                    <div style={{display: "flex", justifyContent: "flex-end", alignItems: "center", margin: 10}}>
                        <Button variant="outlined" type='button' onClick={handleCloseShareModal}>Hủy</Button>
                        <Button variant="contained" type='submit'>Chia sẻ</Button>
                    </div>
                </form>
            </Box>
        </Modal>
    )
}

const ShareLinkModal = ({handleCloseShareLinkModal, openShareLinkModal, file}) => {
    const [link, setLink] = useState("");
    const {enqueueSnackbar} = useSnackbar();
    const handleCopy = () => {
        navigator.clipboard.writeText(`http://localhost:3000/sharelink/${link}`)
        enqueueSnackbar("Đã copy Link", {variant: "success"})
    }
    useEffect(() => {
        setLink(file._id)
    }, [file]);
    return(
        <Modal
            open={openShareLinkModal}
            onClose={handleCloseShareLinkModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            >
            <Box sx={style}>
            <div style={{display: 'flex', alignItems: "center", justifyContent: "space-between", padding: 5}}>
                        <h4 style={{paddingLeft: 10}}>Nhận liên kết chia sẻ</h4>
                        <IconButton aria-label="search-friend" onClick={handleCloseShareLinkModal}>
                            <CloseIcon />
                        </IconButton>
                </div>
                <Divider></Divider>
                <div style={{display: 'flex', alignItems: "center", justifyContent: "center", padding: '1rem'}}>
                    <IconButton sx={{ p: '10px', backgroundColor: "#4285F4", color: "white" }} aria-label="menu">
                        <LinkIcon></LinkIcon>
                    </IconButton>
                    <InputBase
                        sx={{ ml: 1, flex: 1, borderBottom: 1, width: "100%", backgroundColor: "#F1F3F4" }}
                        placeholder="Tên bạn bè, id"
                        inputProps={{ 'aria-label': 'Tên bạn bè' }}
                        onChange={(e) => e.preventDefault()}
                        value={`http://localhost:3000/sharelink/${link}`}
                    />
                </div>
                <div style={{display: "flex", justifyContent: "flex-end", alignItems: "center", margin: 10}}>
                    <Button variant="outlined" type='button' onClick={handleCloseShareLinkModal}>Hủy</Button>
                    <Button variant="contained" type='button' onClick={handleCopy}>Sao chép</Button>
                </div>
            </Box>
        </Modal>
    )
}


const DocumentHeader = () => {
    const navigate = useNavigate();
    const tabs = useSelector(state => state.current.tabs);
    const page = useSelector(state => state.current.page);
    const selectedFile = useSelector(state => state.current.file);
    const rowsPerPage = useSelector(state => state.file.limit);
    const params = useParams();
    const [path, setPath] = useState(null)
    const [openShareModal, setOpenShareModal] = React.useState(false);
    const [openShareLinkModal, setOpenShareLinkModal] = React.useState(false);
    const dispatch = useDispatch()
    const { enqueueSnackbar } = useSnackbar();
    
    const handleClick = () => {
        dispatch(setIsShowInfo());
    }

    const  handleClickLink = (e) => {
        e.preventDefault()
        navigate('/')
    }

    const handleDownload = async () => {
        if(!selectedFile._id) {
            return;
        }
        dispatch(downLoadFile(selectedFile)).then((action) => {
            if(action.meta.requestStatus === "rejected") {
              navigate('/error')
            }
        });
    }

    const handleShare = async () => {
        setOpenShareModal(true);
    }

    const handleCloseShareModal = () => {
        setOpenShareModal(false)
    }

    const handleShareLink = async () => {
        setOpenShareLinkModal(true);
    }

    const handleCloseShareLinkModal = () => {
        setOpenShareLinkModal(false)
    }

    const handleDeleteFile = () => {
        if(!selectedFile._id) {
            return;
        }
        const configReq = {
            method: 'get',
                url: '/file/delete',
                header: {
                    "Content-Type": "text/plain"
                },
                params: {
                    fileId: selectedFile._id,
                    type : tabs === 0 ? "own" : "shared"
                }
        }
        enqueueSnackbar("Đang xóa !", {variant: "info"})
        sendReq(configReq).then((res) => {
            dispatch(setFile({
                _id: null
            }))
            if(res.status === 200) {
                dispatch(getFile({type : tabs === 0 ? "own" : "shared", path: params.path ? params.path : "/", page: page, limit: rowsPerPage})).then((action) => {
                    if(action.meta.requestStatus === "rejected") {
                      navigate('/error')
                    }
                    if(res.data.isAuthenticated === false) {
                        navigate('/signin')
                    }
                    else {
                        enqueueSnackbar(res.data.message.mess, {variant: res.data.message.type})
                    }
                })
            }
            else {
                navigate('/error')
            }
        })
    }
    
    React.useEffect(() => {
        if(params.path === selectedFile._id) {
            setPath(selectedFile.name)
        }
        else {
            setPath(null)
        }
        dispatch(getFriend({type: "friend", page: 0})).then((action) => {
            if(action.meta.requestStatus === "rejected") {
              navigate('/error')
            }
            else if(action.payload.isAuthenticated === false) {
                navigate('/signin')
            }
        });
    },[params])

    return(
        <>
            <div className="document-header">
                {tabs === 0 ?
                    !path ? 
                        <Link underline="hover" color="inherit" onClick={handleClickLink} sx={{cursor: 'pointer'}}>
                            Tài liệu của tôi
                        </Link>
                        :<div style={{display: "flex", alignItems: "center"}}><Link underline="hover" color="inherit" onClick={handleClickLink} sx={{cursor: 'pointer'}}>
                            {"Tài liệu của tôi"}
                        </Link>
                        <ArrowRightIcon/>{path}</div>
                    : !path ? 
                    <Link underline="hover" color="inherit" onClick={handleClickLink} sx={{cursor: 'pointer'}}>
                        Được chia sẻ với tôi
                    </Link>
                    :<div style={{display: "flex", alignItems: "center"}}><Link underline="hover" color="inherit" onClick={handleClickLink} sx={{cursor: 'pointer'}}>
                        {"Đươc chia sẻ với tôi"}
                    </Link>
                    <ArrowRightIcon/>{path}</div>}
                <div className="document-header__list-ctrl">   
                    {selectedFile._id ?
                    <div style={{display: "flex"}}>
                        <>
                            <ShareLinkModal handleCloseShareLinkModal={handleCloseShareLinkModal} openShareLinkModal={openShareLinkModal} file={selectedFile}></ShareLinkModal>
                            <Tooltip title="Nhận link chia sẻ">
                                <IconButton onClick={handleShareLink}>
                                    <LinkIcon />
                                </IconButton>
                            </Tooltip>
                        </>
                        <>
                            <ShareModal handleCloseShareModal={handleCloseShareModal} openShareModal={openShareModal} file={selectedFile}></ShareModal>
                            <Tooltip title="Chia sẻ">
                                <IconButton onClick={handleShare}>
                                    <GroupAddIcon />
                                </IconButton>
                            </Tooltip>
                        </>
                        <Tooltip title="Tải về">
                            <IconButton onClick={handleDownload}>
                                <DownloadIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Xóa">
                            <IconButton onClick={handleDeleteFile}>
                                <DeleteIcon />
                            </IconButton>
                        </Tooltip>
                        <Divider orientation="vertical" variant="middle" flexItem />
                    </div> : ""}
                    <Tooltip title="Xem chi tiết">
                        <IconButton onClick={handleClick}>
                            <InfoIcon />
                        </IconButton>
                    </Tooltip>
                </div>
            </div>
            <Divider></Divider>
        </>
    )
}

export default DocumentHeader;