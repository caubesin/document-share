const {getFileById, downLoadFile, deleteFile, shareFile, addChildrenFile, addUserShareFile} =  require("../helper/file_helper");
const Message = require("../helper/message_helper");
const {addOwnFiles} = require('../helper/user_helper');

exports.getOneFile = async (req, res) => {
  try {
    const file = await getFileById(req.query.fileId);
    res.send(file)
  }
  catch(err) {
    res.status(500).send("");
  }
}

exports.upLoadFile = async (req, res) => {
  try {
    if(req.url === '/upload/multiple') {
      const result = req.files.map( async (file) => {
        await addOwnFiles(req.user._id, file.id)
        if(file.metadata.parent !== "/") {
          await addChildrenFile(file.metadata.parent, file.id)
        }
      })
      Promise.all[result]
    }
    else {
      await addOwnFiles(req.user._id, req.file.id)
      if(req.file.metadata.parent !== "/") {
        await addChildrenFile(req.file.metadata.parent, req.file.id)
      } 
    }
    res.json({
      message: Message("success", "Upload thành công !")
    })
  }
  catch(err) {
      res.status(500).json({
        message: Message("error", "Lỗi upload hãy thử lại !")
      })
  }
}

exports.downLoadFile = async (req, res) => {
    try {
      const file = await getFileById(req.params.fileId);
      if(file.metadata.isDir) {
        return;
     }
     else {
      const result = await downLoadFile(req.params.fileId);
      res.set({
        'Content-Type': file.contentType,
      });
      result.pipe(res)
     }
    }
    catch(err) {
      res.status(500).json({
        message: Message("error", "Lỗi tải xuống !")
      })
    }
}

exports.deleteFile = async (req, res) => {
  
  try {
    await deleteFile(req.user._id, req.query.fileId, req.query.type);
    res.json({
      message : Message("success", "Xóa thành công !")
    })
  }
  catch(err) {
    res.status(500).json({
      message : Message("error", "Lỗi xóa file hãy thử lại !")
    })
  }
}

exports.shareFile = async (req, res) => {
  try {
    await shareFile(req.body.userId, req.body.fileId);
    await addUserShareFile(req.body.userId, req.body.fileId);
    res.json({
      message : Message("success", "Chia sẻ thành công !")
    })
  }
  catch(err) {
    res.status(500).json({
      message : Message("error", "Lỗi chia sẻ hãy thử lại !")
    })
  }
}

exports.accessShareLink = async (req, res) => {
  try {
      await shareFile(req.user._id, req.query.link);
      res.json({
        message : Message("success", "Chia sẻ thành công !")
      })
  }
  catch(err) {
    res.status(500).json({
      message : Message("error", "Lỗi !")
    })
  }
}


