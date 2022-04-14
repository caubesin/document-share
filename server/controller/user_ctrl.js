const {getOwnFileAndFolder, getShareFileAndFolder, getFriend, handleFriend, findFriend} = require('../helper/user_helper');
const Message = require('../helper/message_helper');
exports.getUserData = (req, res) => {
    res.send(req.user);
}

exports.getCurrentFileAndFolder = async (req,res) => {
    let result;
    try {
        if(req.query.type === "own") {
            result = await getOwnFileAndFolder(req.user._id, req.query.path, req.query.page, Number.parseInt(req.query.limit))
        }
        else if(req.query.type === "shared") {
            result = await getShareFileAndFolder(req.user._id, req.query.path, req.query.page, Number.parseInt(req.query.limit));
        }
        
        res.json({
            file: result.file,
            length: result.length[0] ? result.length[0].length : 0,
            message: Message("success", "Thành công !")
        })
    }
    catch(err) {
        res.status(500).json({
            file: [],
            message: Message("error", "Lỗi !")
        })
    }
}

exports.getFriendUser = async (req, res) => {
    try {
        const friend = await getFriend(req.user.friend, req.query.type, req.query.page);
        if(friend.length < 4) {
            friend.push("END");
        }
        res.send(friend)
    }
    catch(err) {
        res.status(500).send(err);
    }
}

exports.handleFriend = async (req, res) => {
    try {
        await handleFriend(req.user._id,req.query.type, req.query.id);
        res.send({
            message: Message("success", "Success")
        })
    }
    catch(err) {
        res.status(500).send({
            type: 'error',
            mess: "Lỗi !"
        });
    }
}

exports.findFriend = async (req, res) => {
    try {
        const result = await findFriend(req.query.id);      
        res.send(result)
    }
    catch(err) {
        res.status(500).send({
            message: Message("error", "Lỗi !")
        });
    }
}

