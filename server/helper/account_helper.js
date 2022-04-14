const {db, User} = require('../config/mongoDb_config.js');
const ObjectId = require('mongoose').Types.ObjectId;

const findUserToLogin = (id, done) => {
    try {
        const users = db.collection('users');
        return new Promise((resolve, reject) => {
            users.findOne({_id: ObjectId(id)}, (err, result) => {
                resolve(done(err,result));
            })
        })
    }
    catch(err) {
        return err;
    }
}

const findUserByUserName = (username) => {
    try {
        const users = db.collection('users');
        return new Promise((resolve, reject) => {
            users.findOne({username: username}, (err, user) => {
                if(err) reject(err);
                resolve(user);
            })
        })
    }
    catch(err) {
        return err;
    }
}

const createNewAccount = async (data) => {
    const userData  = new User(data);
    userData.password = userData.generateHash();
    try {
        await userData.save()
        return true;
    }
    catch {
        return false
    }
}

module.exports = {
    findUserToLogin,
    findUserByUserName,
    createNewAccount
}