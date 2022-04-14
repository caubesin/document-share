import {createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import sendReq from '../helper/sendReqToServer';
import { useNavigate } from "react-router-dom";

export const sendReqLogin = createAsyncThunk(
    "localhost:4000/account/signin",
    async (dataReq, thunkAPI) => {
        const configReq = {
            method: 'POST',
            url: '/account/signin',
            header: {
                "Content-Type": 'application/x-www-form-urlencoded;charset=utf-8'
            },
            data: dataReq
        }
        const res = await sendReq(configReq)
        return res.data
    }
)

export const sendReqReLogin = createAsyncThunk(
    "localhost:4000/",
    async (thunkAPI) => {
        const configReq = {
            method: 'get',
            url: '',
            header: {
                "Content-Type": 'text/plain; charset=utf-8'
            },
            data: ""
        }
        const res = await sendReq(configReq);
        return res.data
    }
)

export const sendReqRegister = createAsyncThunk(
    "localhost:4000/account/signup",
    async (dataReq,thunkAPI) => {
        const configReq = {
            method: 'POST',
            url: '/account/signup',
            header: {
                "Content-Type" : 'application/x-www-form-urlencoded;charset=utf-8'
            },
            data: dataReq
        }
        const res = await sendReq(configReq);
        return res.data
    }
)

export const sendReqLogout = createAsyncThunk(
    "localhost:4000/account/logout",
    async (dataReq,thunkAPI) => {
        const configReq = {
            method: 'GET',
            url: '/account/logout',
        }
        const res = await sendReq(configReq);
        return res.data
    }
)

const authenticate = createSlice({
    name: "authenticate",
    initialState: {
        auth : {
            isAuthenticated: false,
            message: {
                type: null,
                mess: null
            },
        },
        isLoading : false
    },
    reducers : {
        setMess : (state, action) => {
            state.auth.message = {
                type: action.payload.type,
                mess: action.payload.mess
            }
        },
        setIsLoad : (state, action) => {
            state.isLoading = action.payload
        }
    },
    extraReducers : (builder) => {
        builder.addCase(sendReqLogin.pending, (state, action) => {
            state.isLoading = true;
        })
        builder.addCase(sendReqLogin.fulfilled , (state, action) => {
            state.auth = action.payload
            state.isLoading = false;
        })

        builder.addCase(sendReqRegister.pending, (state, action) => {
            state.isLoading = true;
        })
        builder.addCase(sendReqRegister.fulfilled , (state, action) => {
            state.auth = action.payload
            state.isLoading = false;
        })

        
        builder.addCase(sendReqReLogin.pending, (state, action) => {
            state.isLoading = true;
        })
        builder.addCase(sendReqReLogin.fulfilled , (state, action) => {
            state.auth = action.payload
            state.isLoading = false;
        })

        builder.addCase(sendReqLogout.pending, (state, action) => {
            state.isLoading = true;
        })
        builder.addCase(sendReqLogout.fulfilled , (state, action) => {
            state.auth = action.payload;
            state.isLoading = false;
        })
    }
})

export const {setMess, setIsLoad} = authenticate.actions;
export default authenticate.reducer;