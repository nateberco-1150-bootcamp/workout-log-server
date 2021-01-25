const router = require('express').Router();
const User = require('../db').import('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

/* USER REGISTER *********** */
router.post('/register', function (req, res) {
    User.create({
        username: req.body.username,
        passwordhash: bcrypt.hashSync(req.body.passwordhash, 12)
    })
    .then(
        function createSuccess(user) {
            let token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: 60 * 60 * 12});

            res.json({
                user: user,
                message: 'User successfully created!',
                sessionToken: token
            });
        }
    )
    .catch(err => res.status(500).json({ error: err }))
});

/* USER LOGIN ********** */
router.post('/login', function (req, res) {
    User.findOne({
        where: {
            username: req.body.username
        }
    })
    .then(function loginSuccess(user) {
        if (user) {
            bcrypt.compare(req.body.passwordhash, user.passwordhash, function (err, matches) {
                if (matches) {

            let token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: 60 * 60 * 12});

        res.status(200).json({
            user: user,
            message: "User logged in successfully!",
            sessionToken: token
        })
    } else {
        res.status(500).json({ error: "Login Failed."})
    }
    });
} else {
    res.status(500).json({ error: "User does not exist."})
}
    })
    .catch(err => res.status(500).json({ error: err }))
});

module.exports = router;

