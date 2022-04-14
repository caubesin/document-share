const {db, Folder} = require('../config/mongoDb_config');
const gfs = require('../config/gridFS.config');
const ObjectId = require('mongoose').Types.ObjectId;

exports.getFileById =async (id) => {
    const fs_file = db.collection("fs.files");
    const folders = db.collection("folders");
    try {
       const file = await fs_file.findOne({_id: ObjectId(id)});
       const folder = await folders.findOne({_id: ObjectId(id)});
       
       return file || folder;
    }
    catch(err) {
        return err;
    }
}

exports.getAll = () => {
    try {
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
    catch(err) {
        return err;
    }
}

exports.getListFile = (listFile, path) => {
    const fs_file = db.collection("fs.files");
    const fileId = listFile.map(id => ObjectId(id));
    try {
        return fs_file.find({_id: {$in: fileId}, 'metadata.parent': path}).toArray();
    }
    catch(err) {
        return err;
    }

}

exports.getFileData = (id) => {
    try {
        const fs_chunk = db.collection("fs.chunks");
        return new Promise((resolve, reject) => {
            fs_chunk.findOne({files_id: ObjectId(id)}, (err, res) => {
                if(err) reject(err);
                resolve(res)
            })
        })
    }
    catch(err) {
        return err;
    }
}

exports.deleteFile = async (userId, fileId, type) => {
    try{
        const result = [];
        const user = db.collection('users');
        const files = db.collection("fs.files")
        const folders = db.collection("folders")
        const chunks = db.collection("fs.chunks");
        switch(type) {
            case "own" : {
                const query = (link) => [
                    { $match: {own_files: ObjectId(fileId)}},
                    {
                        $lookup: {
                            from: "folders",
                            pipeline: [
                                { $match:  {_id: ObjectId(link)}}
                            ],
                            as: "folder"
                        }
                    },
                    {
                        $lookup: {
                            from: "fs.files",
                            pipeline: [
                                { $match: {_id: ObjectId(link)}}
                            ],
                            as: "file"
                        }
                    },
                    { $project: { items: { $concatArrays: ["$folder", "$file"] } } },
                    { $unwind: "$items"},
                    { $unset: "_id"}
                ];
                const loop = async (file) => {
                    let res = [];
                    await Promise.all(file[0].items.child.map( async (child) => {     
                        try {
                            const resultLoop = await user.aggregate(query(child)).toArray();
                            res = [...res, resultLoop];
                        }
                        catch(err) {
                            throw err;
                        }
                    }))
                    return res;
                }
                
                const loopQuery = async (file) => {
                    if(file.length !== 0) {
                        result.push(file[0].items._id);
                        if(file[0].items.metadata.isDir) {
                            await loop(file).then(async (res) => {
                                await Promise.all(res.map(async (file) => {
                                    await loopQuery(file)
                                }))
                            })
                        }
                    }
                }
                
                await user.aggregate(query(fileId)).toArray().then(async (file) => {
                    await loopQuery(file).then( async () => {
                        try {
                            await chunks.deleteMany({files_id: {$in: result}})
                            await files.deleteMany({_id: {$in: result}});
                            await folders.deleteMany({_id: {$in: result}});
                            await folders.updateMany({child: {$in: result}}, {$pullAll: {child: result}});
                            await user.updateOne({_id: ObjectId(userId)}, {$pullAll: {own_files: result}});
                            await user.updateMany({shared_files: {$in: result}}, {$pullAll: {shared_files: result}});
                        }
                        catch(err) {
                            throw err;
                        }
                    })
                })
                return;
            }
            case "shared" : {
                try {
                    await user.updateOne({_id: ObjectId(userId)}, {$pull: {shared_files: ObjectId(fileId)}})
                    return;
                }
                catch(err) {
                    throw err;
                }
            }
        }
    }
    catch(err) {
        return err;
    }
}

exports.downLoadFile = async (id) => {
    try {
        return await gfs.openDownloadStream(ObjectId(id));
    }
    catch(err) {
        return err;
    }
}

exports.addChildrenFile = (parentId, fileId) => {
    try {
        const folder = db.collection("folders");
        return new Promise((resolve, reject) => {
            folder.updateOne({_id: ObjectId(parentId)}, {$push: {child: ObjectId(fileId)}}, (err) => {
                if(err) reject(err);
                resolve(true);
            })
        })
    }
    catch(err) {
        return err;
    }

}

exports.addUserShareFile = async (id, fileId) => {
    try {
        const files = db.collection("fs.files");
        const folder = db.collection("folders");
        const user = db.collection('users');
        let result = [];
        let arrayId = [];
        if(typeof id === "string") {
            arrayId = JSON.parse(id);
            arrayId = arrayId.map((id) => {
                return ObjectId(id)
            })
        }
        else arrayId = [id];
        const query = (link) => [
            //{$match: {_id: {$in: arrayId}}},
            {
                $lookup: {
                    from: "folders",
                    pipeline: [
                        { $match:  {_id: ObjectId(link)}}
                    ],
                    as: "folder"
                }
            },
            {
                $lookup: {
                    from: "fs.files",
                    pipeline: [
                        { $match: {_id: ObjectId(link)}}
                    ],
                    as: "file"
                }
            },
            { $project: { items: { $concatArrays: ["$folder", "$file"] } } },
            { $unwind: "$items"},
            { $unset: "_id"}
        ];
        
        const loop = async (file) => {
            let res = [];
            await Promise.all(file[0].items.child.map(async (child) => {     
                try {
                    const resultLoop = await user.aggregate(query(child)).toArray();
                    res = [...res, resultLoop];
                }
                catch(err) {
                    throw err;
                }
            }))
            return res;
        }

        const loopQuery = async (file) => {
            if(file.length !== 0) {
                result.push(file[0].items._id);
                if(file[0].items.metadata.isDir) {
                    await loop(file).then(async (res) => {
                        await Promise.all(res.map(async (file) => {
                            await loopQuery(file)
                        }))
                    })
                }
            }
        }
        await user.aggregate(query(fileId)).toArray().then(async (file) => {
            await loopQuery(file).then(async () => {
                try {
                    let userFind = await user.find({_id: {$in: arrayId}}).toArray();
                    userFind = await userFind.map((item) => {
                        return item.name;
                    })
                    await files.updateMany({_id: { $in: result}}, {$addToSet: {"metadata.shared": { $each: userFind}}}, {upsert: true})
                    await folder.updateMany({_id: { $in: result}}, {$addToSet: {"metadata.shared": { $each: userFind}}}, {upsert: true})
                }
                catch(err) {
                    throw err;
                }
            })
            
        })
    }
    catch(err) {
        throw err;
    }
}

exports.shareFile = async (id, link) => {
    try{
        let result = [];
        let arrayId = [];
        
        if(typeof id === "string") {
            arrayId = JSON.parse(id);
            arrayId = arrayId.map((id) => {
                return ObjectId(id)
            })
        }
        else arrayId = [id];

        const user = db.collection('users');
        const query = (link) => [
            //{$match: {_id: {$in: arrayId}}},
            {
                $lookup: {
                    from: "folders",
                    pipeline: [
                        { $match:  {_id: ObjectId(link)}}
                    ],
                    as: "folder"
                }
            },
            {
                $lookup: {
                    from: "fs.files",
                    pipeline: [
                        { $match: {_id: ObjectId(link)}}
                    ],
                    as: "file"
                }
            },
            { $project: { items: { $concatArrays: ["$folder", "$file"] } } },
            { $unwind: "$items"},
            { $unset: "_id"}
        ];
        
        const loop = async (file) => {
            let res = [];
            await Promise.all(file[0].items.child.map(async (child) => {     
                try {
                    const resultLoop = await user.aggregate(query(child)).toArray();
                    res = [...res, resultLoop];
                }
                catch(err) {
                    throw err;
                }
            }))
            return res;
        }

        const loopQuery = async (file) => {
            if(file.length !== 0) {
                result.push(file[0].items._id);
                if(file[0].items.metadata.isDir) {
                    await loop(file).then(async (res) => {
                        await Promise.all(res.map(async (file) => {
                            await loopQuery(file)
                        }))
                    })
                }
            }
        }
        await user.aggregate(query(link)).toArray().then(async (file) => {
            await loopQuery(file).then(async () => {
                try {
                    await user.updateMany({_id: { $in: arrayId}}, {$addToSet: {shared_files: { $each: result}}}, {upsert: true})
                }
                catch(err) {
                    throw err;
                }
            })
            
        })
    }
    catch(err) {
        throw err;
    }
}

