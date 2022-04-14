const {createFolder} = require('../helper/folder_helper');
const Message = require("../helper/message_helper");

exports.createFolder = async (req, res) => {
    try {
      await createFolder(req.query.name, req.query.path, req.user._id, req.user.name);
      res.json({
        message: Message('success', "Tạo thành công !")
      })
    }
    catch(err) {
      res.status(500).json({
        message: Message('error', "Tạo thất bại !")
      })
    }
}