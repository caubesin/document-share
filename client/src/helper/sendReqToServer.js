import axios from 'axios';

const sendReq = (configReq) => {
    return new Promise((resolve, reject) => {
        const config = {
            method: configReq.method,
            url: `http://localhost:4000${configReq.url}`,
            headers: configReq.header || "",
            withCredentials: true,
            data: configReq.data || "",
            params: configReq.params || "",
            responseType: configReq.responseType || "",
            signal: configReq.signal || "",
            onUploadProgress: configReq.onUploadProgress || ""
        }
        axios.request(config)
            .then((res) => resolve(res))
            .catch(err => reject(err))
    })
}

export default sendReq;