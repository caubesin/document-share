import React, {useState} from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import './css/account.css'
import { sendReqLogin,setMess, setIsLoad } from '../features/authenticateSlice';
import CircularProgress from '@mui/material/CircularProgress';
import qs from 'qs';
import $ from 'jquery';
import { useNavigate } from "react-router-dom";
import {useDispatch, useSelector} from 'react-redux';
import Logo from "../assets/img/document-share.png";
import FormImg from "../assets/img/form-img.jpg";

function Signin() {
    const auth = useSelector((state) => state.authenticate.auth.isAuthenticated);
    const message = useSelector(state => state.authenticate.auth.message);
    const isLoad = useSelector(state => state.authenticate.isLoading);
    
    const [typeField, setTypeField] = useState({
        username: false,
        password: false,
    })
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const handleChange = () => {
        dispatch(setMess({
            type: null,
            mess: null
        }));
        navigate('/signup');
    };
    
    const checkSignIn = (data) => {
        if(data.username === "") {
            setTypeField({
                ...typeField,
                username: true
            })
            dispatch(setMess({
                type: 'error field',
                mess: "Tên đăng nhập không được trống !"
            }))
            return false;
        }
        else if(data.password === "") {
            setTypeField({
                username: false,
                password: true
            })
            dispatch(setMess({
                type: 'error field',
                mess: "Mật khẩu không được trống !"
            }))
            return false;
        }
        else {
            setMess({
                type: null,
                mess: null
            })
            return true;
        }
    }

    const handleClick = (e) => {
        e.preventDefault();
        setTypeField({
            username:false,
            password: false
        })
        dispatch(setMess({
            type: null,
            mess: null
        }))
        const username = String($('#username').val());
        const password = String($('#password').val());
        const data = {
            username: username,
            password: password
        }
        if(checkSignIn(data)) {
            const dataReq = qs.stringify({
                "username": `${username}`,
                "password": `${password}`
            })
            dispatch(setIsLoad(true))
            setTimeout(() => {
                dispatch(sendReqLogin(dataReq)).then((action) => {
                    if(action.meta.requestStatus === "rejected") {
                        navigate('/error')
                    }
                    else if(action.payload.isAuthenticated) {
                        navigate("/main")
                    }
                })
            }, 2000)
        }
    }
    return(
        <div className='account-page'>
            <div className='account-form form-signin'>
                <div className='account-form__img'>
                    <img src={FormImg} alt="FormImg"/>
                </div>
                <form className='account-form__form' onSubmit={handleClick}>
                    <img src={Logo} alt="Logo"/>
                    <div className='form__header'>
                        <h2>Đăng nhập</h2>
                        <h4>Tiếp tục với tài khoản Dshare</h4>
                    </div>
                    <div className='form__body'>
                        {message.type === "error" && <Alert severity={(message.type === "error" && "error") || (message.type === "error field" && "error")}>{message.mess}</Alert>}
                        <TextField id="username" label="Tên người dùng" error={typeField.username || message.type === "error"} variant="outlined" className='acf_b-textField' margin="normal"/>
                        <TextField id="password" label="Mật khẩu" error={typeField.password || message.type === "error"} variant="outlined" className='acf_b-textField'margin="normal" autoComplete='off' type="password"/>
                    </div>
                    <div className='form__bottom'>
                        <Button variant="contained" type='submit' size="large" className='btn-submit' >{isLoad ? <CircularProgress color="secondary" id='loading'/> : "Đăng nhập"}</Button>
                        <span>Bạn không có tài khoản ?</span>
                        <Button variant="text" size="small" className='btn-registration' onClick={handleChange}>Tạo tài khoản</Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Signin;