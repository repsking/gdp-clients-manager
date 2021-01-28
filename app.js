const express = require('express');
const cors = require("cors");
const auth = require("./middlewares/auth");
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const demandStatusRouter = require('./routes/demandStatus')
const rolesRouter = require('./routes/roles')
const originsRouter = require('./routes/roles')
const demandsRouter = require('./routes/demands');
const errorMiddleware = require('./middlewares/errors')

const {connectMongoDb} = require("./config/db");
const mongoose = require("mongoose");
const { json } = require('body-parser');
const API_PREFIX = 'api'
const app = express();

connectMongoDb();
mongoose.set("toJSON", { virtuals: true });

app.use(cors());
app.use(json());

app.use(`/${API_PREFIX}/users`, usersRouter);
app.use(`/${API_PREFIX}/demands`,demandsRouter);
app.use(auth);

// Routes which need Authentification
app.use(`/${API_PREFIX}`, indexRouter);
app.use(`/${API_PREFIX}/status`, demandStatusRouter)
app.use(`/${API_PREFIX}/roles`, rolesRouter)
app.use(`/${API_PREFIX}/origins`, originsRouter) 



app.use(errorMiddleware);

module.exports = app;
