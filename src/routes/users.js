const express = require('express');
const router = express.Router();
const {database} = require('../config/helpers');

router.get('/', function (req, res) {
    database.query("SELECT * FROM users", (err, result) => {
        if (err) {
            res.json(err);
        } else {
            res.json({ result });
        }
    });
});

/**
 * ROLE 777 = ADMIN 
 * ROLE 555 = CUSTOMER
 */

router.get('/:userId', (req, res) => {
    let userId = req.params.userId;
    database.query(`SELECT * FROM users where id = ${userId}`, (err, result) => {
        if (err) {
            res.json({ message: `Usuário não encontrado com ID: ${userId}` });
        } else {
            res.json({ result });
        }
    });
});

router.patch('/:userId', async(req, res) => {
    let userId = req.params.userId;
    await database.query(`SELECT * FROM users where id = ${userId}`, (err, result) => {
        if (result){
            let userEmail = req.body.email;
            let userPassword = req.body.password;
            let userFirstName = req.body.fname;
            let userLastName = req.body.lname;
            let userUsername = req.body.username;
            let age = req.body.age;
            database.query(`update users 
            set email = ${ userEmail !== undefined ? userEmail : user.email },
                password = ${ userPassword !== undefined ? userPassword : user.password },
                username = ${ userUsername !== undefined ? userUsername : user.username },
                fname = ${ userFirstName !== undefined ? userFirstName : user.fname },
                lname = ${ userLastName !== undefined ? userLastName : user.lname },
                age = ${ age !== undefined ? age : user.age } where id = ${userId}`, (err, result) => {
                    if (result) {
                        res.json('Usuário atualizado com sucesso.');
                    } else {
                        res.json(err);
                    } 
                });
        }
    })

});

module.exports = router;