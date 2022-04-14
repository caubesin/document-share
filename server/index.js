const express = require('express');
const app = express();
const http = require('http');
const exSession = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport');
const cors = require('cors');
require('dotenv').config();

const mainPage_router = require('./routers/main-page_router');
const account_router = require('./routers/account_router');
const file_router = require('./routers/file_router');
const user_router = require('./routers/user_router');
const folder_router = require('./routers/folder_router');

app.use(express.static("public"));
app.use(exSession({ 
    secret: "cats",
    resave: true,
    saveUninitialized: true,
    cookie : {
        secure : false,
       
    }
}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());

const corsOptions = {
    origin: ['http://localhost:3000', "https://caubesin.github.io/document-share-client/"],
    credentials: true,
    header: "Origin, X-Request-With, Content-Type, Accept",
    optionsSuccessStatus: 200,
    methods: "GET, POST, PUT"
}

app.use(cors(corsOptions));

/*app.get('/', (req,res) => {
    res.send("Loi cmnr !Q")
})*/

//todo use Router

app.use('/', mainPage_router)
app.use('/account', account_router);
app.use('/file', file_router);
app.use('/user', user_router);
app.use('/folder', folder_router);

http.createServer(app).listen(4000 || process.env.PORT, () => {
    console.log("Server running !");
})