import { createSlice } from "@reduxjs/toolkit";

const loading = createSlice({
    name: "loading",
    initialState : {
        isPending : false
    },
    reducers : {
        setIsPending : (state, action) => {
            state.isPending = action.payload
        }
    }
})

export const {setIsPending} = loading.actions;
export default loading;