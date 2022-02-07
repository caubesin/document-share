const {db} = require('../config/mongoDb_config');
const ObjectId = require('mongoose').Types.ObjectId;

exports.getFileById = (id) => {
    const fs_file = db.collection("fs.files");
    return new Promise((resolve, reject) => {
        fs_file.findOne({_id: ObjectId(id)}, (err, res) => {
            if(err) reject(err);
            resolve(res)
        })
    })
}

exports.getAll = () => {
    const fs_file = db.collection("fs.files");
    return new Promise((resolve, reject) => {
        fs_file.find({}, (err, res) => {
            let fileMap = {};
            if(err) reject(err)
            res.forEach((file) => {
                fileMap[file._id] = file;
            })
            resolve(fileMap)
        })
    })
}

exports.getListFile = (listFile) => {
    const fs_file = db.collection("fs.files");
    const listFileRes = listFile.map((fileId) => {
        return new Promise((resolve, reject) => {
            fs_file.findOne({_id: ObjectId(fileId)}, (err, res) => {
                if(err) reject(err)
                resolve(res)
            })
        })
    })
    return Promise.all(listFileRes);
}

exports.getFileData = (id) => {
    const fs_chunk = db.collection("fs.chunks");
    return new Promise((resolve, reject) => {
        fs_chunk.find({files_id: ObjectId(id)}, (err, res) => {
            if(err) reject(err);
            resolve(res)
        })
    })
}