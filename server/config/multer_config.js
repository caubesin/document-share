const multer = require('multer');
const {GridFsStorage} = require('multer-gridfs-storage');

const storage = new GridFsStorage({
    url: process.env.MONGODB_LOCAL || process.env.MONGODB_ATLAS,
    file: (req ,file) => {
        return {
           filename: 'file_' + Date.now(),
           metadata: {
            originalname: file.originalname,
            isDir: false,
            own : {
                id: req.user._id,
                name: req.user.name
            },
            ext: file.originalname.split('.').pop(),
            parent: Array.isArray(req.body.parent) ? req.body.parent.at(-1) : req.body.parent,
            shared: []
           },
        }
    }
})
 
const upload = multer({ storage: storage })

module.exports = upload;