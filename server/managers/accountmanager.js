'use static'

const td = require("./../testdata");

/**
 * This class handles logging into the a users account and registering a account.
 *
 * @see [loginAccount()]{@link loginAccount}
 * @class
 */
class AccountManager{

    constructor() {
        // Does nothing
    }

    /**
     * Adds a new user account to the data set
     * @param req
     * @param res
     * @returns {json} Returns "success" on successful account creation, "failure" on failed attempt
     *
     * @example
     * const response = await fetch(`addaccount/${id}`, {
     *     method: 'PUT',
     *     headers: { 'Content-Type': 'application/json' },
     *     body: JSON.stringify({
     *         "uname": <username>,
     *         "pword": <password>,
     *         "email": <email>,
     *         "fname": <forename>,
     *         "lname": <surname>
     *     })
     * });
     */
    newAccount(req, res)    {
        let result = "failure";
        if (req.body.pword == req.body.repword) {
            try {
                td.users.push({
                    "id": 0,
                    "uname": req.body.uname,
                    "password": req.body.pword,
                    "email": req.body.email,
                    "fname": req.body.fname,
                    "lname": req.body.lname
                });
                result = "success";
            } catch (e) {
                console.log(e);
            }
        }
        res.json([result]);
        // TODO: Convert JSON to SQL
    }

    /**
     * Logs in an account and returns a success or failure
     * @param req
     * @param res
     * @returns {json} Returns "success" on successful log in, "failure" on failed attempt
     * In future, convert to return session key on success
     *
     * @example
     * const result = await fetch(`loginaccount/${username}/${password}`);
     */
    loginAccount(req, res) {
        let result = "failure";
        const username = req.params.uname;
        const password = req.params.pword;

        for (let i in td.users){
            console.log(td.users[i].uname)
            console.log(td.users[i].pword)
            console.log(username)
            console.log(password)
            if(username == td.users[i].uname && password == td.users[i].pword){
                result = "success";
                console.log(result)
                break
            }

        }
        res.json([result]);
    }


    /**
     * Checks to see if an account already exists
     * @param req
     * @param res
     * @returns {json} Returns "success" if account exists, returns "failure" if it doesn't
     * @example
     * const result = await fetch(`validateaccount/${username}/${password}`);
     */
    validateAccount(req, res){
        let result = "failure";
        const username = req.params.uname;
        const password = req.params.pword;
        for (let i in td.users)  {
            if (td.users[i].uname == username && td.users[i].pword == password) {
                result = "success";
                break;
            }
        }
        // look at res.send for sending status codes
        res.json([{"result" : result}])
        // TODO: Implement session tokens
    }

    displayMessage(){

    }
}

module.exports = {
    AccountManager,
}