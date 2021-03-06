import React from "react";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getFriend, handleFriend, findFriend, setNullFindFriendRes } from "../../../features/userSlice";
import { setFriend, setIsShowInfo } from "../../../features/currentSlice";
import { getUserData } from "../../../features/userSlice";
import { useNavigate } from "react-router-dom";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Loading from "../../loading";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Divider from "@mui/material/Divider";
import Modal from '@mui/material/Modal';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import InputBase from '@mui/material/InputBase';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import Tooltip from '@mui/material/Tooltip';
import InfoIcon from '@mui/icons-material/Info';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import NoFriend from '../../../assets/img/no_friend.jpg';
import NoFriendFound from '../../../assets/img/no_friend_found.png';
import FindFriend from '../../../assets/img/search.gif';
import InfiniteScroll from "react-infinite-scroll-component";
import { useSnackbar } from 'notistack';

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

function TabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 2 }}>
            {children}
          </Box>
        )}
      </div>
    );
}

function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
}

const ButtonHandleFriend = ({handleAdd, handleDelete, index}) => {
    if(index === 0) {
        return(<>
            <Button
            onClick={handleDelete}
            variant="outlined"
        >X??a b???n b??</Button>
        </>)
    }
    if(index===1) {
        return(<>
            <Button
                onClick={handleAdd}
                variant="contained"
            >Ch???p nh???n</Button>
            <Button
            onClick={handleDelete}
            variant="outlined"
            >X??a y??u c???u</Button>
        </>)
    }
    else return(<>
        <Button
        onClick={handleDelete}
        variant="outlined"
        >H???y y??u c???u</Button>
    </>)
}

const ButtonModal = ({friendRes}) => {
    const friend = useSelector(state => state.user.user.user_info.friend);
    const user_id = useSelector(state => state.user.user.user_info._id)
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {enqueueSnackbar} = useSnackbar();

    const addFriend = async (id) => {
        await dispatch(handleFriend({type: "acceptRequest", id})).then((action) => {
            if(action.meta.requestStatus === "rejected") {
                navigate('/error')
            }
            else if(action.payload.isAuthenticated === false){
                navigate('/signin')
            }
            else {
                enqueueSnackbar(action.payload.message.mess, {variant: action.payload.message.type})
            }
          });
        await dispatch(getUserData()).then((action) => {
            if(action.meta.requestStatus === "rejected") {
              navigate('/error')
            }
        });
    }
    const sendReqFriend = async (id) => {
        await dispatch(handleFriend({type: "sendRequest", id})).then((action) => {
            if(action.meta.requestStatus === "rejected") {
              navigate('/error')
            }
            else if(action.payload.isAuthenticated === false){
                navigate('/signin')
            }
            else {
                enqueueSnackbar(action.payload.message.mess, {variant: action.payload.message.type})
            }
          });
        await dispatch(getUserData()).then((action) => {
            if(action.meta.requestStatus === "rejected") {
                navigate('/error')
            }
          });
    }
    const checkArray = (value) => {
        return value === friendRes[0]._id
    }

    if(friend.accepted.some(checkArray)) {
        return <Button sx={{color: "white"}} variant="contained" disabled>???? l?? b???n</Button>
    }
    else if(friend.request.some(checkArray)) {
        return <Button variant="contained" onClick={() => addFriend(friendRes[0]._id)}>Ch???p nh???n k???t b???n</Button>
    }
    else if(friend.myRequest.some(checkArray)) {
        return <Button sx={{color: "white"}} variant="contained" disabled>???? g???i l???i m???i</Button>
    }
    else if(friendRes[0]._id !== user_id)  {
        return <Button variant="contained" onClick={() => sendReqFriend(friendRes[0]._id)}>K???t b???n</Button>
    }
    else return "";
}

let randomColor;

const ModalFriend = ({handleClose, open}) => {
    const [valueField, setValueField] = React.useState('')
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const findFriendRes = useSelector(state => state.user.friend.findFriendRes);
    const handleFind = async (e) => {
        e.preventDefault();
        await dispatch(getUserData()).then((action) => {
            if(action.meta.requestStatus === "rejected") {
              navigate('/error')
            }
        });
        await dispatch(findFriend(valueField)).then((action) => {
            if(action.meta.requestStatus === "rejected") {
              navigate('/error')
            }
        });
    }

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <div style={{display: 'flex', alignItems: "center", justifyContent: "space-between", padding: 5}}>
                    <h4 style={{paddingLeft: 10}}>T??m ki???m b???n b??</h4>
                    <IconButton aria-label="search-friend" onClick={handleClose}>
                        <CloseIcon />
                    </IconButton>
                </div>
                <Divider></Divider>
                <form onSubmit={handleFind}>
                    <div>   
                        <IconButton sx={{ p: '10px' }} aria-label="menu">
                            <PersonSearchIcon />
                        </IconButton>
                        <InputBase
                            sx={{ ml: 1, flex: 1, borderBottom: 1, width: "80%" }}
                            placeholder="T??n b???n b??, id"
                            inputProps={{ 'aria-label': 'T??n b???n b??' }}
                            autoFocus={true}
                            onChange={(e) => setValueField(e.currentTarget.value)}
                        />
                    </div>
                    {!findFriendRes ? 
                        <div style={{display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column"}}>
                            <img src={FindFriend} alt="Find Friend" width="300px" style={{margin: "1rem"}}/>
                            <p style={{fontWeight: 500}}>Nh???p ID ????? t??m b???n</p>
                            <sub>K???t b???n ????? kh??m ph?? nhi???u ??i???u m???i</sub>
                        </div>
                        : Object.keys(findFriendRes).length === 0 ? 
                        <div style={{display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column"}}>
                            <img src={NoFriendFound} alt="No Friend Found" width="300px" style={{margin: "1rem"}}/>
                            <p style={{fontWeight: 500}}>Kh??ng t??m th???y b???n</p>
                            <sub>H??y t??m l???i</sub>
                        </div>
                        :
                        <div className="friend-info" style={{width: "100%", display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
                            <div style={{width: "100%", display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
                                <Avatar sx={{backgroundColor: randomColor}}></Avatar>
                                <h4>{findFriendRes[0].name}</h4>
                            </div>
                            <p style={{width: "100%"}}>Thu???c t??nh</p>
                            <table className="friend-info__table">
                                <tbody>
                                <tr>
                                    <td>ID</td>
                                    <td>{findFriendRes[0]._id}</td>
                                </tr>
                                <tr>
                                    <td>S??? h???u</td>
                                    <td>{findFriendRes[0].own_files.length}</td>
                                </tr>
                                <tr>
                                    <td>Chia s???</td>
                                    <td>{findFriendRes[0].shared_files.length}</td>
                                </tr>
                                <tr>
                                    <td>B???n b??</td>
                                    <td>{findFriendRes[0].friend.accepted.length}</td>
                                </tr>
                                </tbody>
                            </table>
                            <ButtonModal friendRes={findFriendRes}></ButtonModal>
                        </div>}
                    <div style={{display: "flex", justifyContent: "flex-end", alignItems: "center", margin: 10}}>
                        <Button variant="outlined" onClick={handleClose}>H???y</Button>
                        <Button variant="contained" type='submit'>T??m ki???m</Button>
                    </div>
                </form>
            </Box>
        </Modal>
    );
}

const FriendTable = ({index, type}) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [hasMore, setHasMore] = React.useState(true)
    const [items, setItems] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const currentFriend = useSelector(state => state.current.friend);
    const { enqueueSnackbar } = useSnackbar();
    
    const loadFriend = async () => {
        dispatch(getFriend({type, page})).then((action) => {
            if(action.meta.requestStatus === "rejected") {
                navigate('/error')
            }
            else if(action.payload[0] === "END") {
                setHasMore(false);
            }
            else {
                setItems(items.concat(action.payload));
                setPage(page + 1)
            }
        })
    }

    const selectFriend = (value) => {
        dispatch(setFriend(value))
    }

    const handleAdd = async (id) => {
        if(index === 1) {
            dispatch(handleFriend({type: "acceptRequest", id})).then((action) => {
                if(action.meta.requestStatus === "rejected") {
                    navigate('/error')
                }
                else if(action.payload.isAuthenticated === false){
                    navigate('/signin')
                }
                else {
                    enqueueSnackbar(action.payload.message.mess, {variant: action.payload.message.type})
                    dispatch(getFriend({type: "reqFriend", page: 0})).then((action) => {
                        if(action.meta.requestStatus === "rejected") {
                          navigate('/error')
                        }
                        else if(action.payload[0] === "END") {
                            setHasMore(false);
                            setItems([])
                        }
                        else {
                            setItems(action.payload);
                            setPage(1)
                        }
                    });
                }
            })
        }
    }
    const handleDelete = async (id) => {
        if(index === 0) {
            dispatch(handleFriend({type: "deleteFriend", id})).then((action) => {
                dispatch(setFriend({
                    _id: null
                }))
                if(action.meta.requestStatus === "rejected") {
                    navigate('/error')
                }
                else if(action.payload.isAuthenticated === false){
                    navigate('/signin')
                }
                else {
                    enqueueSnackbar(action.payload.message.mess, {variant: action.payload.message.type})
                    dispatch(getFriend({type: "friend", page: 0})).then((action) => {
                        if(action.meta.requestStatus === "rejected") {
                            navigate('/error')
                        }
                        else if(action.payload[0] === "END") {
                            setHasMore(false);
                            setItems([])
                        }
                        else {
                            setItems(action.payload);
                            setPage(1)
                        }
                })}
            })
        }
        else if(index === 1) {
            dispatch(handleFriend({type: "deleteRequest", id})).then((action) => {
                dispatch(setFriend({
                    _id: null
                }))
                if(action.meta.requestStatus === "rejected") {
                    navigate('/error')
                }if(action.meta.requestStatus === "rejected") {
                    navigate('/error')
                }
                else if(action.payload.isAuthenticated === false){
                    navigate('/signin')
                }
                else {
                    enqueueSnackbar(action.payload.message.mess, {variant: action.payload.message.type})
                    dispatch(getFriend({type: "reqFriend", page: 0})).then((action) => {
                        if(action.payload[0] === "END") {
                            setHasMore(false);
                            setItems([])
                        }
                        else {
                            setItems(action.payload);
                            setPage(1)
                        }
                    })
                }
            })
        }
        else if(index === 2) {
            dispatch(handleFriend({type: "deleteMyRequest", id})).then((action) => {
                dispatch(setFriend({
                    _id: null
                }))
                if(action.meta.requestStatus === "rejected") {
                    navigate('/error')
                }
                if(action.meta.requestStatus === "rejected") {
                    navigate('/error')
                }
                else if(action.payload.isAuthenticated === false){
                    navigate('/signin')
                }
                else {
                    enqueueSnackbar(action.payload.message.mess, {variant: action.payload.message.type})
                    dispatch(getFriend({type: "myReqFriend", page: 0})).then((action) => {
                        if(action.payload[0] === "END") {
                            setHasMore(false);
                            setItems([])
                        }
                        else {
                            setItems(action.payload);
                            setPage(1)
                        }
                    })
                }
            })
        }
    }

    useEffect(() => {
        dispatch(getFriend({type, page})).then((action) => {
            if(action.meta.requestStatus === "rejected") {
                navigate('/error')
            }
            else if(action.payload[0] === "END") {
                setHasMore(false);
                setItems([])
            }
            else {
                setItems(action.payload);
                setPage(page + 1)
            }
        })
        randomColor = "#" + Math.floor(Math.random()*16777215).toString(16);
    }, [index])

    if(items.length === 0) {
        return(
            <div style={{display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column"}}>
                <img src={NoFriend} alt="No Own File" width="400px" style={{margin: "1rem"}}/>
                {index === 0 ? 
                <>
                    <p style={{fontWeight: 500}}>Hi???n t???i b???n kh??ng c?? b???n</p>
                    <sub>H??y k???t b???n ????? kh??m ph?? nh???ng ??i???u m???i m???</sub>
                </> : index === 1 ? 
                <>
                    <p style={{fontWeight: 500}}>Hi???n t???i b???n kh??ng c?? y??u c???u k???t b???n</p>
                    <sub>C??? t??? t??? s??? c?? th??i...</sub>
                </> : 
                <>
                    <p style={{fontWeight: 500}}>Hi???n t???i b???n kh??ng c?? l???i m???i ???? g???i</p>
                    <sub>H??y g???i l???i m???i k???t b???n ????? t??m ???????c nhi???u b???n m???i</sub>
                </>}
            </div>
        )
    }
    return(<>
        <List dense sx={{ width: '100%', bgcolor: 'background.paper' }}>
        <InfiniteScroll
            dataLength={items.length}
            next={loadFriend}
            hasMore={hasMore}
            loader={<Loading></Loading>}
            height={"100%"}
        >
            {items.map((value) => {
                if(value === "END") return "";
                const labelId = `checkbox-list-secondary-label-${value._id}`;
                return (
                    <ListItem
                        key={value._id}
                        value={value._id}
                        selected={currentFriend._id === value._id}
                        onClick={(event) => {
                            if(event.currentTarget.getAttribute("value")===currentFriend._id) return;
                            selectFriend(value)
                        }}
                        secondaryAction={
                            <>
                                {<ButtonHandleFriend handleAdd={() => handleAdd(value._id)} handleDelete={() => handleDelete(value._id)} index={index}></ButtonHandleFriend>}
                            </>
                        }
                        disablePadding
                    >
                        
                        <ListItemButton>
                        <ListItemAvatar>
                            <Avatar sx={{backgroundColor: "#1976d2"}}></Avatar>
                        </ListItemAvatar>
                        <ListItemText id={labelId} primary={value.name} />
                        </ListItemButton>
                    </ListItem>
                );
            })}
        </InfiniteScroll>
        </List>
    </>)
}

const Friend = () => {
    const dispatch = useDispatch();
    const isLoad = useSelector(state => state.user.isLoading)
    const friend = useSelector(state => state.user.friend);
    const [value, setValue] = React.useState(0);
    const [open, setOpen] = React.useState(false);

    const handleOpen = () => setOpen(true);

    const handleClose = () => {
        setOpen(false);
        dispatch(setNullFindFriendRes());
    }
    const handleChange = (event, newValue) => {
        setValue(newValue);
        dispatch(setFriend({
            _id: null
        }))
    };

    const showFriendInfo = () => {
        dispatch(setIsShowInfo());
    }

    if(isLoad) {
        return <Loading></Loading>
    }
    else return(
        <>
            <div>
                <Box sx={{ width: '100%' }}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider', display: "flex", alignItems: "center", justifyContent: "space-between"}}>
                        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                            <Tab sx={{textTransform: 'none', fontWeight: 600}} label="B???n b??" {...a11yProps(0)} />
                            <Tab sx={{textTransform: 'none', fontWeight: 600}} label="Y??u c???u k???t b???n" {...a11yProps(1)} />
                            <Tab sx={{textTransform: 'none', fontWeight: 600}} label="L???i m???i ???? g???i" {...a11yProps(2)} />
                        </Tabs>
                        <div style={{marginRight: "10px"}}>
                            <Tooltip title="Th??m b???n b??">
                                <IconButton onClick={handleOpen}>
                                    <PersonAddIcon />
                                </IconButton>
                            </Tooltip>
                            <ModalFriend handleClose={handleClose} open={open}  ></ModalFriend>
                            <Tooltip title="Xem chi ti???t">
                                <IconButton onClick={showFriendInfo}>
                                    <InfoIcon />
                                </IconButton>
                            </Tooltip>
                        </div>
                    </Box>
                    <TabPanel value={value} index={0}>
                        <FriendTable friend={friend.friend} index={0} type="friend"></FriendTable>
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                        <FriendTable friend={friend.friend} index={1} type="reqFriend"></FriendTable>
                    </TabPanel>
                    <TabPanel value={value} index={2}>
                        <FriendTable friend={friend.friend} index={2} type="myReqFriend"></FriendTable>
                    </TabPanel>
                </Box>
            </div>
        </>
    )
}

export default Friend;