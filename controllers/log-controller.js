let express = require('express');
let router = express.Router();
let validateSession = require('../middleware/validate-session');
const Log = require('../db').import('../models/log');

//Create Log Entry
router.post('/', validateSession, (req, res) => {
    const logEntry = {
        description: req.body.log.description,
        definition: req.body.log.definition,
        result: req.body.log.result,
        owner_id: req.user.id
    }
    Log.create(logEntry)
        .then(log => res.status(200).json(log))
        .catch(err => res.status(500).json({ error: err}))
});

//Get ALL Entries for a Specific
router.get("/", validateSession, (req, res) => {
    const query = { where: {owner_id: req.user.id} };
    Log.findAll(query)
    .then(logs => res.status(200).json(logs))
    .catch(err => res.status(500).json({ error: err }))
});

//Get Entries by ID for specific User
router.get('/:id', validateSession, (req, res) => {

    const query = { where: { id: req.params.id, owner_id: req.user.id} };
    Log.findAll(query)
    .then(logs => res.status(200).json(logs))
    .catch(err => res.status(500).json({ error: err }))
});

//Update
router.put('/:id', validateSession, function (req, res) {
    const updateLogEntry = {
        description: req.body.log.description,
        definition: req.body.log.definition,
        result: req.body.log.result
    };

    const query = { where: { id: req.params.id, owner_id: req.user.id} };

    Log.update(updateLogEntry, query)
    .then((logs) => res.status(200).json(logs))
    .catch((err) => res.status(500).json({ error: err }));
});


//Delete
router.delete("/:id", validateSession, function (req, res) {
    const query = { where: { id: req.params.id, owner_id: req.user.id } };

    Log.destroy(query)
    .then(() => res.status(200).json({ message: "Log Removed!" }))
    .catch((err) => res.status(500).json({ error: err }));
});


module.exports = router