const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
const db = mongoose.connection;


mongoose.connect(process.env.MONGODB_LOCAL || process.env.MONGODB_ATLAS, {useNewUrlParser: true, useNewUrlParser: true,  useUnifiedTopology: true});

db.once('open', () => {
    console.log("Kết nối thành công !");
})
db.on('error', (err) => {
    throw err;
})

const userSchema = new Schema({
    name: {type: String},
    username: { type: String, required: true},
    password: { type: String, required: true },
    own_files: {type: Array, default: []},
    shared_files: {type: Array, default: []},
    friend: {
        request: {type:  Array, default: []},
        accepted: {type:  Array, default: []},
        myRequest: {type:  Array, default: []}
    }
})

userSchema.methods.generateHash = function () {
    return bcrypt.hashSync(this.password,bcrypt.genSaltSync(8),null);
}

userSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
}

const User = mongoose.model("users", userSchema);

const folderSchema = new Schema({
    name: {type: String},
    child: {type: Array, default: []},
    uploadDate: {type: Date},
    metadata : {
        isDir: {type: Boolean, default: true},
        parent: {type: String},
        own: {type: Object},
        shared: {type: Array}
    }
})

const Folder = mongoose.model("folders", folderSchema);

module.exports = {
    User,
    db,
    Folder
}