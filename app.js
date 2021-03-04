const logger = require('morgan')
const {connectMongoDb} = require("./config/db");
const {authUser} = require("./middlewares/auth")
const { sanitize } = require('./middlewares/sanitize')
const mongoose = require("mongoose");
const cors = require("cors");
const { json } = require('body-parser');
const express = require('express');
const app = express();
const { NotFoundError } = require('./Errors')
const errorMiddleware   = require('./middlewares/errors')

// All App Routers
const usersRouter = require('./routes/users');
const statusRouter = require('./routes/status')
const rolesRouter = require('./routes/roles')
const originsRouter = require('./routes/origin')
const actionsRouter = require('./routes/action')
const demandsRouter = require('./routes/demands');
const contactsRouter = require('./routes/contact');
const fixturesRouter = require("./routes/fixtures")

connectMongoDb();
mongoose.set("toJSON", { virtuals: true });

app.use(logger('dev'));
app.use(cors());
app.use(json());

const API_PREFIX = 'api';

// Clean All object to prevent xss attacks
app.use(sanitize);

// Opened Routes which doesn't need Authentification token
app.use(`/${API_PREFIX}/users`, usersRouter);
app.use(`/${API_PREFIX}/demands`,demandsRouter);

// Routes which need Authentification
app.use(`/${API_PREFIX}/status`, authUser, statusRouter)
app.use(`/${API_PREFIX}/roles`, authUser, rolesRouter)
app.use(`/${API_PREFIX}/origins`, authUser, originsRouter)
app.use(`/${API_PREFIX}/actions`, authUser, actionsRouter)
app.use(`/${API_PREFIX}/fixtures`, authUser, fixturesRouter)
app.use(`/${API_PREFIX}/contacts`, authUser, contactsRouter)


// 404 handler
app.use((req, res, next) => next(NotFoundError()));

// All errors management
app.use(errorMiddleware);

module.exports = app;