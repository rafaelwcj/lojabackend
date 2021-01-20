const express = require('express');
const { check, validationResult, body } = require('express-validator');

const router = express.Router();

const helper = require('../config/helpers');
const jwt = require('jsonwebtoken');
//const bcrypt = require('bcrypt');       
            
router.post('/login', async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    helper.database.query(`select password, id, email, role 
        from users where email = '${email}'`, (err, user) => {
            if(user) {

            }
    })
    
});        

router.post('/register', (req, res) => {
  
        let email = req.body.email;
        let username = email.split('@')[0];
        let password = req.body.password
        //let password = await bcrypt.hash(req.body.password, 10);
        let fname = req.body.fname;
        let lname = req.body.lname;
        let role = req.body.role;
        let address = req.body.address;

        let sqlUsers = `insert into users (username,
            password,
            email,
            role,
            lname,
            fname)
             values (
            '${username}',
            '${password}',
            '${email}',
            '${role}',
            '${lname || null}',
            '${fname || null}')`

        helper.database.query(sqlUsers, (err, result) => {

            if(result.insertId > 0) {
                if(address.length > 0){
                    let cep = address[0].cep;
                    let endereco = address[0].endereco;
                    let cidade = address[0].cidade;
                    let estado = address[0].estado;
                    let telefone = address[0].telefone;
                    let observacao = address[0].observacao;
                    let entrega = address[0].entrega;

                    let sqlAddress = `insert into addresses (cep,
                        endereco,
                        cidade,
                        estado,
                        telefone,
                        observacao,
                        user_id,
                        entrega)
                         values (
                        '${cep}',
                        '${endereco}',
                        '${cidade}',
                        '${estado}',
                        '${telefone}',
                        '${observacao || null}',
                        ${result.insertId},
                        '${entrega}')`

                    helper.database.query(sqlAddress);

                }
                res.json({ success: true, id: result.insertId, role: role, message: 'Cadastro realizado com sucesso.' }); 
            } else {
                res.json({ success: false, message: 'Cadastro não realizado.' }); 
            }

    });

});



       

module.exports = router;