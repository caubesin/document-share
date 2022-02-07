const {findUserByUserName, createNewAccount} = require("../helper/account_helper");

exports.sendLoginPage = (req, res) => {
    res.json({
        isAuthenticated: false,
        message: {
            type: null,
            mess: null
        },
    });
}

exports.fail_authenticate = (req, res) => {
    res.json({
        isAuthenticated: false,
        message: {
            type: "error",
            mess: "Sai tài khoản hoặc mật khẩu !"
        }
    })
}

exports.successAuth = async (req, res) => { 
    res.json({
        isAuthenticated: true,
        message: {
            type: "success",
            mess: "Đăng nhập thành công !"
        },
        data: "data"
    });
}

exports.signUpReq = async (req, res) => {
    const result = await findUserByUserName(req.body.username);
    if(result) {
        res.json({
            isAuthenticated: false,
            message: {
                type: "error",
                mess: "Tài khoản đã tồn tại !"
            }
        })
    }
    else {
        const create_result = await createNewAccount(req.body);
        if(create_result) {
            res.json({
                isAuthenticated: false,
                message: {
                    type: "success",
                    mess: "Đăng ký thành công ! Hãy đăng nhập !"
                }
            })
        }
        else {
            res.json({
                isAuthenticated: false,
                message: {
                    type: "error",
                    mess: "Lỗi !"
                }
            })
        }
    }
}