const multer = require('multer');
const {GridFsStorage} = require('multer-gridfs-storage');

const storage = new GridFsStorage({
    url: process.env.MONGODB_LOCAL || process.env.MONGODB_ATLAS,
    file: (req, file) => {
        return {
           filename: 'file_' + Date.now(),
           originalname: file.originalname
        }
    }
})
 
const upload = multer({ storage: storage })

module.exports = upload;