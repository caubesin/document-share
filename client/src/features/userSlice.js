import {createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import sendReq from '../helper/sendReqToServer'

export const getUserData = createAsyncThunk(
    "localhost:4000/user",
    async (thunkAPI) => {
        const configReq = {
            method: 'get',
            url: '/user',
            header: {
                "Content-Type": "text/plain"
            },
            data: ""
        }
        const res = await sendReq(configReq)
        return res.data
    }
)

export const getFriend = createAsyncThunk(
    "localhost:4000/user/friend",
    async ({type, page},thunkAPI)  => {
        const configReq = {
            method: 'get',
                url: '/user/friend',
                header: {
                    "Content-Type": "text/plain"
                },
                params: {
                    type: type,
                    page: page
                }
        }
        const res = await sendReq(configReq)
        return res.data
    }
)

export const handleFriend = createAsyncThunk(
    "localhost:4000/user/friend/handle",
    async ({type, id},thunkAPI)  => {
        const configReq = {
            method: 'get',
                url: '/user/friend/handle',
                header: {
                    "Content-Type": "text/plain"
                },
                params: {
                    type: type,
                    id: id
                }
        }
        const res = await sendReq(configReq)
        return res.data
    }
)

export const findFriend = createAsyncThunk(
    "localhost:4000/user/friend/find",
    async (id,thunkAPI)  => {
        const configReq = {
            method: 'get',
                url: '/user/friend/find',
                header: {
                    "Content-Type": "text/plain"
                },
                params: {
                    id: id
                }
        }
        const res = await sendReq(configReq)
        return res.data
    }
)

const user = createSlice({
    name: "user",
    initialState: {
        user : {
            isLoad: false,
            user_info: null
        },
        friend: {
            isLoad: true,
            friend: [],
            findFriendRes: null,
            message: ""
        }
    },
    reducers: {
        setNullFindFriendRes : (state, action) => {
            state.friend.findFriendRes = null
        }
    },
    extraReducers : (builder) => {
        builder.addCase(getUserData.pending, (state, action) => {
            state.user.isLoad = true
        })
        builder.addCase(getUserData.fulfilled, (state, action) => {
            state.user.user_info = action.payload
            state.user.isLoad = false
        })
        builder.addCase(getUserData.rejected, (state, action) => {
            console.log(action.payload)
        })

        builder.addCase(getFriend.pending, (state, action) => {
            state.friend.isLoad = true
        })
        builder.addCase(getFriend.fulfilled, (state, action) => {
            state.friend = {
                ...state.friend,
                isLoad: false,
                friend: action.payload
            }
        })
        builder.addCase(getFriend.rejected, (state, action) => {
            console.log(action.payload)
        })

        builder.addCase(handleFriend.pending, (state, action) => {
            state.friend.isLoad = true
        })
        builder.addCase(handleFriend.fulfilled, (state, action) => {
            state.friend.isLoad = false
            state.friend.message = action.payload
        })
        builder.addCase(handleFriend.rejected, (state, action) => {
            console.log(action.payload)
        })

        builder.addCase(findFriend.fulfilled, (state, action) => {
            state.friend.findFriendRes = action.payload
        })
        builder.addCase(findFriend.rejected, (state, action) => {
            console.log(action.payload)
        })
    }
})



export const {setNullFindFriendRes} = user.actions;
export default user.reducer;