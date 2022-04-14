import React from "react";
import { useEffect } from "react";
import {useParams, useNavigate} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getFile, setLimit } from "../../../features/fileSlice";
import { getCurrentFile, setPath, setParent, setCurrentPage } from "../../../features/currentSlice";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import moment from "moment";
import FileCustomIcon from "../../react-file-icon/file-icon";
import FolderIcon from '../../../assets/img/folder.svg';
import NoOwnFile from '../../../assets/img/no_own_file.jpg';
import NoShareFile from '../../../assets/img/no_share_file.jpg'
import TablePagination from '@mui/material/TablePagination';
import Loading from "../../loading";
import Divider from "@mui/material/Divider";
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import { Tooltip } from "@mui/material";

function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <Tooltip title="Trang đầu">
          <IconButton
            onClick={handleFirstPageButtonClick}
            disabled={page === 0}
            aria-label="first page"
          >
            {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
          </IconButton>
      </Tooltip>
      <Tooltip title="Trang trước">
        <IconButton
          onClick={handleBackButtonClick}
          disabled={page === 0}
          aria-label="previous page"
        >
          {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
        </IconButton>
      </Tooltip>
      <Tooltip title="Trang kế">
        <IconButton
          onClick={handleNextButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="next page"
        >
          {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
        </IconButton>
      </Tooltip>
      <Tooltip title="Trang cuối">
        <IconButton
          onClick={handleLastPageButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="last page"
        >
          {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
        </IconButton>
      </Tooltip>
    </Box>
  );
}


function DocumentTable() {
  const dispatch = useDispatch();
  const params = useParams();
  const navigate = useNavigate();
  const tabs = useSelector(state => state.current.tabs);
  const isLoad = useSelector(state => state.file.isLoading);
  const file = useSelector(state => state.file.file);
  const rowsPerPage = useSelector(state => state.file.limit);
  const length = useSelector(state => state.file.length);
  const selectedFile = useSelector(state => state.current.file)
  const path = useSelector(state => state.current.path);
  const currentPage = useSelector(state => state.current.page);
  
  const handleClick = async (e) => {
    if(e.currentTarget.getAttribute("value")===selectedFile._id) return;
    dispatch(getCurrentFile(e.currentTarget.getAttribute("value"))).then((action) => {
      if(action.meta.requestStatus === "rejected") {
        navigate('/error')
      }
    })
  }

  const handleDoubleClick = async () => {
    if(selectedFile.metadata.isDir) {
      dispatch(setParent(selectedFile._id))
      navigate(`/main/${selectedFile._id}`)
      dispatch(setPath(`/${selectedFile.name}`))
    } 
  }

  const handleChangeRowsPerPage = (event) => {
    dispatch(setLimit(parseInt(event.target.value, 10)));
    dispatch(setCurrentPage(0));
  };

  const isItemSelect = (id) => selectedFile._id === id;

  const handleChangePage = (event, newPage) => {
    dispatch(setCurrentPage(newPage));
  };
  
  useEffect(() => {
    dispatch(getFile({type : tabs === 0 ? "own" : "shared", path: params.path ? params.path : "/", page: currentPage, limit: rowsPerPage})).then((action) => {
      if(action.meta.requestStatus === "rejected") {
        navigate('/error')
      }
      if(action.meta.requestStatus === "rejected") {
        navigate('/error')
      }
      else if(action.payload.isAuthenticated === false) {
        navigate('/signin')
      }
    })
  }, [tabs, params.path, currentPage, rowsPerPage])

  if(isLoad) {
    return(
      <Loading></Loading>
    )
  }
  else if(file.length===0) {
    if(tabs === 0) {
      return(
        <div style={{display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column"}}>
          <img src={NoOwnFile} alt="No Own File" width="400px" style={{margin: "1rem"}}/>
          <p style={{fontWeight: 500}}>Không có tệp hoặc thư mục của tôi</p>
          <sub>Hãy tải lên hoặc tạo thư mục</sub>
        </div>
      )
    }
    else {
      return(
        <div style={{display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column"}}>
          <img src={NoShareFile} alt="No Share File" width="350px"/>
          <p style={{fontWeight: 500}}>Không có tệp hoặc thư mục được chia sẻ</p>
          <sub>Hãy tìm bạn để được chia sẻ tài liệu</sub>
        </div>
      )
    }
  }
  else return (
    <Paper sx={{width: "100%",height: "100%", display: "flex", flexDirection: "column"}}>
        <TableContainer sx={{maxHeight: "82vh", flexGrow: 1}}>
          <Table sx={{ minWidth: 650, boxShadow: 'none', overflow: "auto" }} stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell>Tên</TableCell>
                <TableCell align="center">Chủ sở hữu</TableCell>
                <TableCell align="center" >Thời gian tải lên</TableCell>
                <TableCell align="center">Kích cỡ tệp</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {file.map((file) => (
                <TableRow
                  hover
                  onClick={handleClick}
                  onDoubleClick={handleDoubleClick}
                  key={file.items._id}
                  value={file.items._id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 }, 'th': {fontWeight: "bold"} }}
                  selected = {isItemSelect(file.items._id)}
                >
                  <TableCell component="th" scope="row" sx={{display: 'flex', maxHeight: 100, alignItems: "center"}}>
                    { file.items.metadata.isDir ?
                      <div className="icon">
                        <img src={FolderIcon} style={{width: '100%'}} alt="folder"/>
                      </div>
                      :<FileCustomIcon ext={file.items.metadata.ext}></FileCustomIcon>
                    }
                    {file.items.metadata.isDir ? file.items.name : file.items.metadata.originalname}
                  </TableCell>
                  <TableCell align="center">{file.items.metadata.own.name}</TableCell>
                  <TableCell align="center">{moment(file.items.uploadDate).utc().format("MMM Do, YYYY")}</TableCell>
                  <TableCell align="center">{Math.round(file.items.length/1024) < 1 || file.items.metadata.isDir ? "-" : Math.round(file.items.length/1024) + " KB"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Divider></Divider>
        </TableContainer>
      <Divider></Divider>
      <TablePagination
          component="div"
          count={length}
          page={currentPage}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          style={{alignSelf: "flex-start"}}
          ActionsComponent={TablePaginationActions}
      />
    </Paper>
  );
}

export default DocumentTable;