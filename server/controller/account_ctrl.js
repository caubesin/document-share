const {findUserByUserName, createNewAccount} = require("../helper/account_helper");
const Message = require('../helper/message_helper');

exports.sendLoginPage = (req, res) => {
    res.json({
        isAuthenticated: false,
        message: {
            type: null,
            mess: null
        }
    });
}

exports.fail_authenticate = (req, res) => {
    res.json({
        isAuthenticated: false,
        message: Message("error", "Sai tài khoản hoặc mật khẩu !")
    })
}

exports.successAuth = async (req, res) => { 
    res.json({
        isAuthenticated: true,
        message: Message("success", "Đăng nhập thành công !")
    });
}

exports.signUpReq = async (req, res) => {
    try {
        const result = await findUserByUserName(req.body.username);
        if(result) {
            res.json({
                isAuthenticated: false,
                message: Message("error", "Tài khoản đẫ tồn tại")
            })
        }
        else {
            const create_result = await createNewAccount(req.body);
            if(create_result) {
                res.json({
                    isAuthenticated: false,
                    message: Message("success", "Đăng ký thành công hãy đăng nhập !")
                })
            }
            else {
                res.status(500).json({
                    isAuthenticated: false,
                    message: Message("error", "Lỗi đăng ký !")
                })
            }
        }
    }
    catch(err) {
        res.status(500).json({
            isAuthenticated: false,
            message: Message("error", "Lỗi đăng ký !")
        })
    }
}

exports.logout = (req, res) => {
    try {
        req.logout();
        res.json({
            isAuthenticated: false,
            message: Message(null , null)
        })
    }
    catch {
        res.status(500).json({
            isAuthenticated: false,
            message: Message("error", "Lỗi")
        })
    }
}