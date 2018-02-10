var mongoose = require('mongoose');
var User = mongoose.model('User');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var config = require('../settings/config');


module.exports.login = ( req, res ) => {
    console.log(req.body);
    if( !(req.body && req.body.username && req.body.password) ){
        var message = !req.body.username ? "Please provide Username" :  "Please provide password";
        return res.status(400)
                    .json({ message: message });
    }

    User.findOne({
        username: req.body.username
    },function( error, user ){
        if (error) {
            console.log(error);
            res.sendStatus(500);
        } else if ( user ) {
            validateUser(req.body.password, user, res);
        } else {
            res.status(400).json({ message: "User doesn't exist with this username & password"});
        }
    })
}

module.exports.register = ( req, res ) => {
    if( !(req.body && req.body.username && req.body.password && req.body.name) ){
        var message = !req.body.username ? "Please provide Username" : !req.body.password ? "Please provide password" : "Please provide Name";
        return res.status(400)
                    .json({ message: message });
    }

    User.findOne({
        username: req.body.username
    },function( error, user ){
        if (error) {
            console.log(error);
            res.sendStatus(500);
        } else if ( user ) {
            res.status(400).json({ message: "User already exist with this username"});
        } else {
            createUser(req, res);
        }
    })
}

const createUser = (req, res) => {
    User.create({
        username: req.body.username,
        password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10)),
        name: req.body.name
    }, function( error, user ) {
        if (error) {
            console.log(error);
            res.sendStatus(500);
        } else {
            res.status(200).json(user);
        }
    })
};

const validateUser = (plainPassword, dbUser, res) => {
    if( bcrypt.compareSync(plainPassword, dbUser.password) ){
        const user = {
            role: 'admin'
        };
        var token = jwt.sign({ role: 'admin' }, config.keys.secret, { expiresIn: 3600 });
        res.status(200).json({ token: token });
    }else{
        res.status(400).json({ message: "User doesn't exist with this username & password"});
    }
};