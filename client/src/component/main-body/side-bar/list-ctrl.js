import React from "react";
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import ContactPageIcon from '@mui/icons-material/ContactPage';
import ShareIcon from '@mui/icons-material/Share';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import { useSelector, useDispatch } from "react-redux";
import { setTab } from "../../../features/currentSlice";

export default function ListCtrl() {
  const dispatch = useDispatch()
  const selectedIndex = useSelector(state => state.current.tabs)

  const handleListItemClick = (event, index) => {
    dispatch(setTab(index));
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      <List component="nav">
        <ListItemButton
          selected={selectedIndex === 0}
          onClick={(event) => handleListItemClick(event, 0)}
        >
          <ListItemIcon>
            <ContactPageIcon />
          </ListItemIcon>
          <ListItemText primary="Tài liệu của tôi" />
        </ListItemButton>
        <ListItemButton
          selected={selectedIndex === 1}
          onClick={(event) => handleListItemClick(event, 1)}
        >
          <ListItemIcon>
            <ShareIcon />
          </ListItemIcon>
          <ListItemText primary="Được chia sẻ với tôi" />
        </ListItemButton>
      </List>
      <Divider />
      <List component="nav">
        <ListItemButton
          selected={selectedIndex === 2}
          onClick={(event) => handleListItemClick(event, 2)}
        >
          <ListItemIcon>
            <PeopleAltIcon />
          </ListItemIcon>
          <ListItemText primary="Bạn bè" />
        </ListItemButton>
      </List>
    </Box>
  );
}