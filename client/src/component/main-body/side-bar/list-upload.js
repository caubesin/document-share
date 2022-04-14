import React, {useEffect} from "react";
import IconButton from '@mui/material/IconButton';
import FolderIcon from '@mui/icons-material/Folder';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import { SnackbarContent } from "@mui/material";
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { color, fontWeight } from "@mui/system";

function CircularProgressWithLabel(props) {
    return (
      <Box sx={{ position: 'relative', display: 'inline-flex' }}>
        <CircularProgress sx={{
            color: "#44b700"
        }} variant="determinate" {...props} />
        <Box
          sx={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography variant="caption" component="div" sx={{
              color: "black",
              fontWeight: 600
          }}>
            {`${props.value}%`}
          </Typography>
        </Box>
      </Box>
    );
  }

const ListUpLoad = (props) => {
    const [state, setState] = React.useState({
        open: false,
        vertical: 'bottom',
        horizontal: 'right',
      });
    
    const { vertical, horizontal, open } = state;
    
    const handleClose = (e, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setState({ ...state, open: false });
    };
    const onCancelFile = () => {
        props.cancelUploadFile();
        setState({
            ...state,
            open: false
        })
    }

    const action = (
        <>
            <IconButton
                size="small"
                aria-label="cancel"
                onClick={onCancelFile}
                sx={{
                    color: "balck"
                }}
            >
                <DeleteIcon fontSize="medium" />
            </IconButton>
            <CircularProgressWithLabel value={props.fileUpload.progress} />
            
        </>
    )
    
    useEffect(() => {
        if(props.fileUpload.name) {
            setState({
                ...state,
                open: true
            })
            if(props.fileUpload.progress === 100) {
                setTimeout(() => {
                    setState({
                        ...state,
                        open: false
                    })
                }, 5000)
            }
        }
    }, [props.fileUpload])
    
    return(
        <div>
            <Snackbar
                anchorOrigin={{ vertical, horizontal }}
                open={open}
                onClose={handleClose}
                key={vertical + horizontal}
                
            >
                <SnackbarContent
                    message={props.fileUpload.name}
                    action={action}
                    sx={{
                        backgroundColor: "white",
                        color: "black",
                        fontWeight: 700
                    }}
                >

                </SnackbarContent>
            </Snackbar>
        </div>
    )
}

export default ListUpLoad;