const {db} = require('../config/mongoDb_config');
const mongoose = require('mongoose');

const gfs = new mongoose.mongo.GridFSBucket(db,{
    file: (req, file) => {
        if (file.mimetype === 'image/jpeg') {
          return {
            bucketName: 'photos'
          };
        } else {
          return null;
        }
    }
})

module.exports = gfs;

