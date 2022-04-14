import {createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import sendReq from '../helper/sendReqToServer'

export const getCurrentFile = createAsyncThunk(
    "localhost:4000/file/:fileId",
    async (id, thunkAPI) => {
        const configReq = {
            method: 'get',
            url: `/file`,
            params : {
                fileId: `${id}`
            }
        }
        const res = await sendReq(configReq);
        return res.data;
    }
)

const current = createSlice({
    name: 'current',
    initialState: {
        tabs : 0,
        page: 0,
        file : {
            _id: null
        },
        friend: {
            _id: null
        },
        path: '/',
        parent: null,
        isShowInfo: false
    },
    reducers: {
        setTab : (state, action) => {
            state.tabs = action.payload
        },
        setFile : (state, action) => {
            state.file = action.payload
        },
        setIsShowInfo : (state, action) => {
            state.isShowInfo = !state.isShowInfo;
        },
        setPath : (state, action) => {
            state.path = action.payload;
        },
        setParent : (state, action) => {
            state.parent = action.payload;
        },
        setFriend : (state, action) => {
            state.friend = action.payload;
        },
        setCurrentPage : (state, action) => {
            state.page = action.payload;
        }
    },
    extraReducers : (builder) => {
        builder.addCase(getCurrentFile.pending, (state, action) => {

        })
        builder.addCase(getCurrentFile.fulfilled, (state, action) => {
            state.file = action.payload;
        })
        builder.addCase(getCurrentFile.rejected, (state, action) => {
            console.log(action.payload)
        })
    }
})

export const {setTab, setFile, setIsShowInfo, setPath, setFriend, setParent, setCurrentPage} = current.actions;
export default current.reducer;