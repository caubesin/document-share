import {createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import sendReq from '../helper/sendReqToServer'

export const sendReqToServer = createAsyncThunk(
    "localhost:4000",
    async (configReq, thunkAPI) => {
        const res = await sendReq(configReq)
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
            }
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
        builder.addCase(sendReqToServer.pending, (state, action) => {
            state.isLoading = true;
        })
        builder.addCase(sendReqToServer.fulfilled, (state, action) => {
            if(state.auth !== action.payload.isAuthenticated) {
                state.auth = action.payload
            }
            else {
                state.auth.message = action.payload.message
            }
            state.isLoading = false;
        })
    }
})

export const {setMess, setIsLoad} = authenticate.actions;
export default authenticate.reducer;