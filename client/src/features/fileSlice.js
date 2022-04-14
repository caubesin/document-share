import {createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import sendReq from '../helper/sendReqToServer';


export const upLoadFile = createAsyncThunk(
    "localhost:4000/file/upload",
    async (data, thunkAPI) => {
        const configReq = {
            method: 'post',
            url: `/file/upload/${data.type}`,
            header: {},
            data: data.data,
        }
        const res = await sendReq(configReq);
        return res.data;
    }
)

export const downLoadFile = createAsyncThunk(
    "localhost:4000/download",
    async (file, thunkAPI) => {
        const configReq = {
            method: "get",
            url: `/file/download/${file._id}`,
            responseType: "blob"
        }
        await sendReq(configReq)
        .then(async (res) => {
            const link = document.createElement("a");
            link.target = "_blank";
            link.download = file.metadata.originalname;
            link.href = URL.createObjectURL(
                new Blob([res.data], { type: `${res.data.type}` })
            );
            link.click();
        });
    }
)

export const getFile = createAsyncThunk(
    "localhost:4000/data",
    async ({type, path, page, limit},thunkAPI) => {
        const configReq = {
            method: "get",
            url: '/data',
            params: {
                type : type,
                path : path,
                page : page,
                limit: limit
            }
        }
        const res = await sendReq(configReq);
        return res.data
    }
)

export const createFolder = createAsyncThunk(
    "localhost:4000/folder/create",
    async (data,thunkAPI) => {
        const configReq = {
            method: "get",
            url: '/folder/create',
            params: {
                name: data.name,
                path: data.path
            }
        }
        const res = await sendReq(configReq);
        return res.data
    }
)

const file = createSlice({
    name: "file",
    initialState: {
        file: [],
        length: null,
        limit: 10,
        fileDownload: "",
        message: {
            type: null,
            mess: null
        },
        isLoading: true
    },
    reducers: {
        setMessage : (state, action) => {
            state.message = action.payload
        },
        setLimit: (state, action) => {
            state.limit = action.payload
        }
    },
    extraReducers: (builder) => {
        builder.addCase(upLoadFile.pending, (state, action) => {
            state.isLoading = true;
        })
        builder.addCase(upLoadFile.fulfilled, (state, action) => {
            state.isLoading = false;
        })
        builder.addCase(upLoadFile.rejected, (state, action) => {
            console.log(action.payload)
        })

        builder.addCase(getFile.pending, (state, action) => {
            state.isLoading = true
        })
        builder.addCase(getFile.fulfilled, (state, action) => {
            state.file = action.payload.file
            state.length = action.payload.length
            state.isLoading = false
        })
        builder.addCase(getFile.rejected, (state, action) => {
            console.log(action.payload)
        })

        builder.addCase(createFolder.pending, (state, action) => {
            state.isLoading = true
        })
        builder.addCase(createFolder.fulfilled, (state, action) => {
            state.message = action.payload.message
            state.isLoading = false
        })
        builder.addCase(createFolder.rejected, (state, action) => {
            console.log(action.payload)
        })
    }
})

export const {setMessage, setLimit} = file.actions;
export default file.reducer;