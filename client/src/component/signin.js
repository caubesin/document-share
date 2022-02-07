import React, {useState} from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import './css/account.css'
import { sendReqToServer,setMess, setIsLoad } from '../features/authenticateSlice';
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
    const isLoad = useSelector(state => state.authenticate.isLoading)
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

    const handleClick = (event) => {
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
            const configReq = {
                method: 'POST',
                url: '/account/signin',
                header: 'application/x-www-form-urlencoded;charset=utf-8',
                data: qs.stringify({
                    "username": `${username}`,
                    "password": `${password}`
                })
            }
            dispatch(setIsLoad(true))
            setTimeout(() => {
                dispatch(sendReqToServer(configReq))
            }, 2000)
            if(auth) {
                navigate('/document');
            }
        }
    }
    return(
        <div className='account-page'>
            <div className='account-form form-signin'>
                <div className='account-form__img'>
                    <img src={FormImg} alt="FormImg"/>
                </div>
                <form className='account-form__form'>
                    <img src={Logo} alt="Logo"/>
                    <div className='form__header'>
                        <h2>Đăng nhập</h2>
                        <h4>Tiếp tục với tài khoản Dshare</h4>
                    </div>
                    <div className='form__body'>
                        {message.type != null && <Alert severity={(message.type === "error" && "error") || (message.type === "error field" && "error")}>{message.mess}</Alert>}
                        <TextField id="username" label="Tên người dùng" error={typeField.username || message.type === "error"} variant="outlined" className='acf_b-textField' margin="normal"/>
                        <TextField id="password" label="Mật khẩu" error={typeField.password || message.type === "error"} variant="outlined" className='acf_b-textField'margin="normal" autoComplete='off' type="password"/>
                    </div>
                    <div className='form__bottom'>
                        <Button variant="contained" size="large" className='btn-submit' onClick={handleClick}>{isLoad ? <CircularProgress color="secondary" id='loading'/> : "Đăng nhập"}</Button>
                        <span>Bạn không có tài khoản ?</span>
                        <Button variant="text" size="small" className='btn-registration' onClick={handleChange}>Tạo tài khoản</Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Signin;