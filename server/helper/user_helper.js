const {db, User} = require('../config/mongoDb_config.js');
const ObjectId = require('mongoose').Types.ObjectId;


exports.addOwnFiles = (userId, fileId) => {
    try {
        const users = db.collection('users');
        return new Promise((resolve, reject) => {
            users.updateOne({_id: ObjectId(userId)}, {$push: {own_files: fileId}}, (err) => {
                if(err) reject(err);
                resolve(true);
            })
        })
    }
    catch(err) {
        return err;
    }
}

exports.getOwnFileAndFolder = async (id, parent, page, limit) => {
    const user = db.collection("users");
    const query = [
        {$match: {_id: id}},
        {
            $lookup: {
                from: "folders",
                let: {folderId: "$own_files"},
                pipeline: [
                    { $match:
                        { $expr:
                            { $and :
                                [
                                    {$in: ["$_id", "$$folderId"]},
                                    {$eq: ["$metadata.parent", parent]}
                                ]
                            }
                        }
                    }
                ],
                as: "folder"
            }
        },
        {
            $lookup: {
                from: "fs.files",
                let: {fileId: "$own_files"},
                pipeline: [
                    { $match:
                        { $expr:
                            { $and :
                                [
                                    {$in: ["$_id", "$$fileId"]},
                                    {$eq: ["$metadata.parent", parent]}
                                ]
                            }
                        }
                    }
                ],
                as: "file"
            }
        },
        { $project: { items: { $concatArrays: ["$folder", "$file"] }}},
        { $unwind: "$items"},
        { $unset: "_id"},
        { $skip: page*limit},
        { $limit: limit}
    ];
    const count = [
        
        {$match: {_id: id}},
        {
            $lookup: {
                from: "folders",
                let: {folderId: "$own_files"},
                pipeline: [
                    { $match:
                        { $expr:
                            { $and :
                                [
                                    {$in: ["$_id", "$$folderId"]},
                                    {$eq: ["$metadata.parent", parent]}
                                ]
                            }
                        }
                    }
                ],
                as: "folder"
            }
        },
        {
            $lookup: {
                from: "fs.files",
                let: {fileId: "$own_files"},
                pipeline: [
                    { $match:
                        { $expr:
                            { $and :
                                [
                                    {$in: ["$_id", "$$fileId"]},
                                    {$eq: ["$metadata.parent", parent]}
                                ]
                            }
                        }
                    }
                ],
                as: "file"
            }
        },
        { $project: { items: { $concatArrays: ["$folder", "$file"] }}},
        { $unwind: "$items"},
        { $unset: "_id"},
        { $count: "length"}
    ];
    try {
        const file = await user.aggregate(query).toArray()
        const length = await user.aggregate(count).toArray()
        return {
            file: file,
            length: length
        }
    }
    catch(err) {
        return err;
    }
}

exports.getShareFileAndFolder = async (id, parent, page, limit) => {
    const user = db.collection("users");
    const query = [
        {$match: {_id: id}},
        {
            $lookup: {
                from: "folders",
                let: {folderId: "$shared_files"},
                pipeline: [
                    { $match:
                        { $expr:
                            { $and :
                                [
                                    {$in: ["$_id", "$$folderId"]},
                                    {$eq: ["$metadata.parent", parent]}
                                ]
                            }
                        }
                    }
                ],
                as: "folder"
            }
        },
        {
            $lookup: {
                from: "fs.files",
                let: {fileId: "$shared_files"},
                pipeline: [
                    { $match:
                        { $expr:
                            { $and :
                                [
                                    {$in: ["$_id", "$$fileId"]},
                                    {$eq: ["$metadata.parent", parent]}
                                ]
                            }
                        }
                    }
                ],
                as: "file"
            }
        },
        { $project: { items: { $concatArrays: ["$folder", "$file"] } } },
        { $unwind: "$items"},
        { $skip: page*limit},
        { $limit: limit}
    ];
    const count = [
        {$match: {_id: id}},
        {
            $lookup: {
                from: "folders",
                let: {folderId: "$shared_files"},
                pipeline: [
                    { $match:
                        { $expr:
                            { $and :
                                [
                                    {$in: ["$_id", "$$folderId"]},
                                    {$eq: ["$metadata.parent", parent]}
                                ]
                            }
                        }
                    }
                ],
                as: "folder"
            }
        },
        {
            $lookup: {
                from: "fs.files",
                let: {fileId: "$shared_files"},
                pipeline: [
                    { $match:
                        { $expr:
                            { $and :
                                [
                                    {$in: ["$_id", "$$fileId"]},
                                    {$eq: ["$metadata.parent", parent]}
                                ]
                            }
                        }
                    }
                ],
                as: "file"
            }
        },
        { $project: { items: { $concatArrays: ["$folder", "$file"] } } },
        { $unwind: "$items"},
        { $count: "length"}
    ];
    try {
        const file = await user.aggregate(query).toArray()
        const length = await user.aggregate(count).toArray()
        return {
            file: file,
            length: length
        }
    }
    catch(err) {
        return err;
    }
}

exports.getFriend = async (id, type, page) => {
    const user = db.collection('users');
    const limit = 10;
    try {
        switch(type) {
            case "myReqFriend" : {
                return await user.find({_id: {$in: id.myRequest}}).sort({_id: 1}).skip(page*limit).limit(limit).toArray();
            }
            case "reqFriend" : {
                return await user.find({_id: {$in: id.request}}).sort({_id: 1}).skip(page*limit).limit(limit).toArray();
            }
            case "friend": {
                return await user.find({_id: {$in: id.accepted}}).sort({_id: 1}).skip(page*limit).limit(limit).toArray();
            }
        }
    }
    catch(err) {
        return err;
    }
}

exports.handleFriend = async (userId, type, id) => {
    const user = db.collection('users');

    const checkId = (thisId) => thisId.equals(id);

    try {
        const thisUser = await user.findOne({_id: userId});
        switch(type) {
            case "deleteFriend" : {
                if(thisUser.friend.accepted.some(checkId)) {
                    await user.updateOne({_id: userId}, {
                        $pull: {
                            'friend.accepted': ObjectId(id)
                        }
                    });
                    await user.updateOne({_id: ObjectId(id)}, {
                        $pull: {
                            'friend.accepted': userId
                        }
                    });
                    return;
                }
                else return;
            }
            case "deleteRequest" : {
                if(thisUser.friend.request.some(checkId)) {
                    await user.updateOne({_id: userId}, {
                        $pull: {
                            'friend.request': ObjectId(id)
                        }
                    });
                    await user.updateOne({_id: ObjectId(id)}, {
                        $pull: {
                            'friend.myRequest': userId
                        }
                    });
                    return;
                }
                else return;
            }
            case "deleteMyRequest" : {
                if(thisUser.friend.myRequest.some(checkId)) {
                    await user.updateOne({_id: userId}, {
                        $pull: {
                            'friend.myRequest': ObjectId(id)
                        }
                    });
                    await user.updateOne({_id: ObjectId(id)}, {
                        $pull: {
                            'friend.request': userId
                        }
                    });
                    return;
                }
                else return;
            }
            case "acceptRequest" : {
                if(thisUser.friend.request.some(checkId)) {
                    await user.updateOne({_id: userId}, {
                        $push: {
                            'friend.accepted': ObjectId(id)
                        }
                    });
                    await user.updateOne({_id: ObjectId(id)}, {
                        $push: {
                            'friend.accepted': userId
                        }
                    });
                    await user.updateOne({_id: userId}, {
                        $pull: {
                            'friend.request': ObjectId(id)
                        }
                    });
                    await user.updateOne({_id: ObjectId(id)}, {
                        $pull: {
                            'friend.myRequest': userId
                        }
                    });
                    return;
                }
                else return;
            }
            case "sendRequest" : {
                if(!thisUser.friend.accepted.some(checkId)) {
                    await user.updateOne({_id: userId}, {
                        $push: {
                            'friend.myRequest': ObjectId(id)
                        }
                    });
                    await user.updateOne({_id: ObjectId(id)}, {
                        $push: {
                            'friend.request': userId
                        }
                    });
                    return
                }
                else return;
            }
            default : {
                return;
            }
        }
    }
    catch(err) {
       return err;
    }
}

exports.findFriend = async (id) => {
    try {
        const user = db.collection('users');
        return await user.find({_id: ObjectId(id)}).toArray();
    }
    catch(err) {
        return err;
    }
}