/**
 * @module API Tests
 */
'use strict';

const td = require("./testdata");

/**
 * Represents a response to a HTTP GET request
 * @returns {json} Returns "Hello, world" to the client
 * @example
 * async function testConnection()  {
 *     let result = await fetch('tests');
 *     console.log(result);
 * }
 */
function test(req, res) {
    res.json(["Hello, world"]);
}

/**
 * Method for processing a HTTP GET request
 * @returns {json} Returns JSON of all users to the client
 * @example
 * async function listAllUsers()    {
 *      let listOfUsers = await fetch('userlist');
 *      console.log(listOfUsers);
 * }
 */
function userList(req, res) {
    res.json(td.users);
}

module.exports = {
    test,
    userList,
};