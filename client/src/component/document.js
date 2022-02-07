import React, {useState} from "react";
import Button from "@mui/material/Button";
import Input from "@mui/material/Input";
import sendReq from "../helper/sendReqToServer";

const Document = () => {
    const [selectFile, setSelectFile] = useState("");
    const handleSelectFile = (e) => {
        setSelectFile(e.target.files[0])
    }
    const handleClick = () => {
        const data = new FormData();
        data.append("file", selectFile, selectFile.name);

        const reqConfig = {
            method: 'post',
            url: '/upload',
            header: {
                "Content-Type": "multipart/form-data"
            },
            data: data
        }
        sendReq(reqConfig);
    }
    return(
        <>
            <h1>Document here</h1>
            <label htmlFor="contained-button-file">
            <input accept="*" type="file" onChange={handleSelectFile}/>
            {/*<input accept="image/*" type="file" webkitdirectory='true' mozdirectory='true' directory='true' onChange={handleSelectFile}/>*/}
            <button type="button" onClick={handleClick}>
                Upload
            </button>
            </label>
        </>
    )
}

export default Document;