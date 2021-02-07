const morgan = require('morgan')
const {connectMongoDb} = require("./config/db");
const {authUser} = require("./middlewares/auth")
const mongoose = require("mongoose");
const cors = require("cors");
const { json } = require('body-parser');
const express = require('express');
const app = express();

// All App Routers
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const statusRouter = require('./routes/status')
const rolesRouter = require('./routes/roles')
const originsRouter = require('./routes/origin')
const demandsRouter = require('./routes/demands');
const fixturesRouter = require("./routes/fixtures")

connectMongoDb();
mongoose.set("toJSON", { virtuals: true });

app.use(cors());
app.use(json());

const API_PREFIX = 'api';

// Opened Routes which doesn't need Authentification token
app.use(`/${API_PREFIX}/users`, usersRouter);
app.use(`/${API_PREFIX}/demands`,demandsRouter);

app.use(authUser);

// Routes which need Authentification
app.use(`/${API_PREFIX}/status`, statusRouter)
app.use(`/${API_PREFIX}/roles`, rolesRouter)
app.use(`/${API_PREFIX}/origins`, originsRouter)
app.use(`/${API_PREFIX}/fixtures`, fixturesRouter)
app.use(require('./middlewares/errors'));

module.exports = app;
