import React, {useState} from 'react';
import './css/account.css'
import Alert from '@mui/material/Alert';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate } from "react-router-dom";
import {useDispatch, useSelector} from 'react-redux';
import InputAdornment from '@mui/material/InputAdornment';
import { sendReqToServer, setMess, setIsLoad } from '../features/authenticateSlice';
import qs from 'qs';
import $ from 'jquery';
import Logo from "../assets/img/document-share.png";
import FormImg from "../assets/img/form-img.png";

const Signup = () => {
    const message = useSelector(state => state.authenticate.auth.message);
    const [typeField, setTypeField] = useState({
        name: false,
        username: false,
        password: false,
    })
    const isLoad = useSelector(state => state.authenticate.isLoading);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const handleChange = () => {
        dispatch(setMess({
            type: null,
            mess: null
        }));
        navigate('/signin');
    }
    const checkSignUp = (data) => {
        const username_regex = /^[A-Za-z0-9._]{1,15}$/;
        const password_regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,15}$/;
        if(data.firstname === "" || data.lastname === "") {
            setTypeField({
                ...typeField,
                name: true,
            })
            dispatch(setMess({
                type: "error",
                mess: "Họ hoặc tên không được để trống !"
            }))
            return false;
        }
        else if(!username_regex.test(data.username)) {
            setTypeField({
                name: false,
                username: true,
                password: false
            })
            dispatch(setMess({
                type: "error",
                mess: "Tên người dùng không đúng định dạng !"
            }))
            return false;
        }
        else if(!password_regex.test(data.password)) {
            setTypeField({
                name: false,
                username: false,
                password: true
            })
            dispatch(setMess({
                type: "error",
                mess: "Mật khẩu không đúng định dạng !"
            }))
            return false;
        }
        else if(data.password !== data.re_password) {
            setTypeField({
                name: false,
                username: false,
                password: true
            })
            dispatch(setMess({
                type: "error",
                mess: "Xác nhận mật khẩu không đúng !"
            }))
            return false
        }
        else return true;
    }
    const handleClick = () => {
        setTypeField({
            name: false,
            username: false,
            password: false,
        })
        dispatch(setMess({
            type: null,
            mess: null
        }))
        const firstname = String($('#firstname').val());
        const lastname = String($("#lastname").val());
        const username = String($("#s-username").val());
        const password = String($('#s-password').val());
        const re_password = String($('#s-re_password').val());
        const data = {
            firstname: firstname,
            lastname: lastname,
            username: username,
            password: password,
            re_password: re_password,
        }
        if(checkSignUp(data)) {
            const configReq = {
                method: 'POST',
                url: '/account/signup',
                header: 'application/x-www-form-urlencoded;charset=utf-8',
                data: qs.stringify({
                    "firstname": `${firstname}`,
                    "lastname": `${lastname}`,
                    "username": `${username}`,
                    "password": `${password}`
                })
            }
            dispatch(setIsLoad(true))
            setTimeout(() => {
                dispatch(sendReqToServer(configReq))
            }, 2000)
        }
        //navigate('/signin');
    }
    return(
        <div className='account-page'>
            <div className='account-form form-signup'>
                <div className='account-form__img'>
                    <img src={FormImg} alt='Img'/>
                </div> 
                <form className='account-form__form'>
                    <img src={Logo} alt="Logo"/>
                    <div className='form__header'>
                        <h2>Đăng ký</h2>
                        <h4>Tạo tài khoản Dshare</h4>
                    </div>
                    <div className='form__body'>
                    {message.type != null && <Alert severity={message.type}>{message.mess}</Alert>}
                        <div className='acf-row'>
                            <TextField id='lastname' label="Họ" variant="outlined" error={typeField.name} className='acf_b-textField' margin="normal" size='small'/>
                            <TextField id='firstname' label="Tên" variant="outlined" error={typeField.name} className='acf_b-textField'margin="normal" size='small'/>
                        </div>
                        <TextField id='s-username' label="Tên người dùng" variant="outlined" error={typeField.username} className='acf_b-textField'margin="normal" InputProps={{startAdornment: <InputAdornment position="start">@</InputAdornment>,}} size="small" />
                        <span>Từ 1 đến 10 ký tự, bạn có thể sử dụng số và dấu chấm</span>
                        <div className='acf-row'>
                            <TextField id='s-password' label="Mật khẩu" variant="outlined" error={typeField.password} className='acf_b-textField' margin="normal" size='small' autoComplete='off' type="password"/>
                            <TextField id='s-re_password' label="Xác nhận" variant="outlined" error={typeField.password} className='acf_b-textField'margin="normal" size='small' autoComplete='off' type="password"/>
                        </div>
                        <span>Từ 8 đến 15 ký tự bao gồm cả chữ cái và chữ số</span>
                    </div>
                    <div className='form__bottom'>
                        <Button variant="contained" size="large" className='btn-submit' onClick={handleClick}>{isLoad ? <CircularProgress></CircularProgress> : "Đăng ký"}</Button>
                        <span>Bạn đã có tài khoản ?</span>
                        <Button variant="text" size="small" className='btn-registration' onClick={handleChange}>Đăng nhập ngay</Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Signup;