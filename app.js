const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const cors = require("cors");
const auth = require("./middlewares/auth");
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const connectDb = require("./config/db");
const mongoose = require("mongoose");

connectDb();
mongoose.set("toJSON", { virtuals: true });

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/api/users', usersRouter);
app.use(auth);
app.use('/api', indexRouter);


app.use((err, req, res, next) => {
    if(err) {
        console.log("Has an error : ",err);
        res.status(err.status || 400).send(err.message || err);
    }
});

module.exports = app;
