const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
const db = mongoose.connection;


mongoose.connect(process.env.MONGO_LOCAL || process.env.MONGODB_ATLAS, {useNewUrlParser: true, useNewUrlParser: true,  useUnifiedTopology: true});

let gfs;

db.once('open', () => {
    gfs = new mongoose.mongo.GridFSBucket(db,{
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
    console.log("Kết nối thành công !");
})
db.on('error', (err) => {
    throw err;
})

const userSchema = new Schema({
    firstname: {type: String},
    lastname: {type: String},
    username: { type: String, required: true},
    password: { type: String, required: true }
})

userSchema.methods.generateHash = function () {
    return bcrypt.hashSync(this.password,bcrypt.genSaltSync(8),null);
}

userSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
}

const User = mongoose.model("users", userSchema);

module.exports = {
    User,
    db,
}