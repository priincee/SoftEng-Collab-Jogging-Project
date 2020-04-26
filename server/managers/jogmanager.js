'use static'

const td = require("./../testdata");

/**
 * This class handles api calls for creating, starting and finishing a jog.
 * @class
 */
class JogManager {

    constructor() {
        // Does nothing
    }

    achieveConfirm() {
        
    }

    uploadToSocialMedia() {

    }

    /**
     * Get data for the last 10 jogs of a given user.
     * @param req
     * @param res
     *
     * @example
     * async function getJogData(uid)   {
     *     const data = await fetch(`jogs/${uid}`)
     * }
     */
    getData(req, res) {
        const uid = req.params.uid;
        const data = [];
        for (let record in td.jogs) {
            if (td.jogs[record].uid == uid)   {
                data.push(td.jogs[record]);
            }
        }
        if (data.length > 10)   {
            data = data.slice(data.length-10);
        }
        res.json(data);
    }

    /**
     * Recieve jog data to save and record it in the database.
     * @param req
     * @param res
     */
    saveData(req, res)  {
        let result = "success";
        try {
            console.log(req.body);
            td.jogs.push({
                "jogid": req.body.jogid,
                "uid": req.body.uid,
                "time": req.body.time,
                "distance": req.body.distance
            });
        }
        catch(e)    {
            console.log(e);
        }
        res.json(result);
    }

}

module.exports = {
    JogManager,
}