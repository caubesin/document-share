const {db, Folder} = require('../config/mongoDb_config');
const {addOwnFiles} = require('./user_helper');
const {addChildrenFile} = require('./file_helper');
const ObjectId = require('mongoose').Types.ObjectId;

exports.createFolder = async (name, parentPath, userId, userName) => {
    const folder = new Folder();
    folder.metadata.parent = parentPath
    folder.name = name;
    folder.uploadDate = Date.now();
    folder.metadata.own = {
        id: ObjectId(userId),
        name: userName
    };
    try {
        await folder.save().then(addOwnFiles(userId, folder._id))
        await addChildrenFile(parentPath, folder._id)
        return true;
    }
    catch(err) {
        return err;
    }
}

exports.getListFolder = async (listFolder, path) => {
    const folder = db.collection('folders');
    const folderId = listFolder.map(id => ObjectId(id));
    try {
        return folder.find({_id: {$in: folderId}, 'metadata.parent': path}).toArray();
    }
    catch(err) {
        return err;
    }
}

exports.addChildren = async (id, parent) => {
    
}