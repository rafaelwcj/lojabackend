const jwt = require('jsonwebtoken');
const crypto =  require('crypto');
//const bcrypt = require('bcrypt');

const mysql = require('mysql');
const con = mysql.createConnection({
    host: 'us-cdbr-east-03.cleardb.com',
    user: 'baf6284e52aacd',
    password: 'f617c154',
    database: 'heroku_05d6a6bbb6c3d86'
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});

let db = con;

module.exports = {
    database: db
};

const secret = "1SBz93MsqTs7KgwARcB0I0ihpILIjk3w";

module.exports = {
    database: db,
    secret: secret,
    validJWTNeeded: (req, res, next) => {
        if (req.headers['authorization']) {
            try {
                let authorization = req.headers['authorization'].split(' ');
                if (authorization[0] !== 'Bearer') {
                    return res.status(401).send();
                } else {
                    req.jwt = jwt.verify(authorization[1], secret);
                    return next();
                }
            } catch (err) {
                return res.status(403).send("Authentication faileds");
            }
        } else {
            return res.status(401).send("No authorization header found.");
        }
    },    
    hasAuthFields: (req, res, next) => {
        let errors = [];

        if (req.body) {
            if (!req.body.email) {
                errors.push('Missing email field');
            }
            if (!req.body.password) {
                errors.push('Missing password field');
            }

            if (errors.length) {
                return res.status(400).send({errors: errors.join(',')});
            } else {
                return next();
            }
        } else {
            return res.status(400).send({errors: 'Missing email and password fields'});
        }
    },
    isPasswordAndUserMatch: async (req, res, next) => {
        const myPlaintextPassword = req.body.password;
        const myEmail = req.body.email;          
              
        const user = await db.table('users').filter({$or:[{ email : myEmail },{ username : myEmail }]}).get();
        if (user) {
            //const match = await bcrypt.compare(myPlaintextPassword, user.password);
            
            req.username = user.username;
            req.email = user.email;
            next();

            // if (match) {
            //     req.username = user.username;
            //     req.email = user.email;
            //     next();
            // } else {
            //     res.status(401).send("Username or password incorrect");
            // }
            
        } else {
            res.status(401).send("Username or password incorrect");
        }

    }
};
