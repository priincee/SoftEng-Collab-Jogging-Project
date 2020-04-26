'use strict';
const api = require("./api");

// Load managers
const acc = require("./managers/accountmanager");
const jog = require("./managers/jogmanager");
const cha = require("./managers/challengemanager");

const td = require("./testdata.js");

const express = require("express");
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('../routes');
const usersRouter = require('../routes/users');
const app = express();
app.use(express.static("public"));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;

// Start managers
const accMan = new acc.AccountManager();
const jogMan = new jog.JogManager();

// Define API calls
// AccountManager calls
app.get('/loginaccount/:uname/:pword', accMan.loginAccount);
app.get('/validateaccount/:uname/:pword', accMan.validateAccount);
app.post('/newAccount', express.json(), accMan.newAccount);

// ChallengeManager calls
// to get the friends list

// JogManager calls
app.get("/jogs/:uid", jogMan.getData);
app.get("/alljogs", function(req, res) {
    res.json(td.jogs);
});
app.post('/uploaddata', express.json(), jogMan.saveData);

app.get('/tests', api.test);
app.get('/userlist', api.userList);