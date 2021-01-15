const express = require('express');
const router = express.Router();
const {database} = require('../config/helpers');

const mailer = require('../modules/mailer.js');
const { default: ContactRestfulModelCollection } = require('nylas/lib/models/contact-restful-model-collection');

router.get('/', (req, res) => {
    database.query("select o.id, p.title, p.description, p.price, u.username " +
            "from orders_details od join order o on o.id = od.order_id " +
            "join products p on p.id = od.product_id join users u on u.id = o.user_id", (err, result) => {
                if(result) {
                    res.json(orders);
                } else {
                    res.json({ message: 'Não encontrado pedido.' });
                }
    });
});

router.get('/:id', async (req, res) => {
    let orderId = req.params.id;
    database.query(`select o.id, p.title, p.description, p.price, p.image, od.quantity as quantityOrdered
    from orders_details od 
    join orders o 
    on o.id = od.order_id 
    join products p 
    on p.id = od.product_id 
    join users u on u.id = o.user_id
    where o.id = ${orderId}`, (err, result) => {
        if(result) {
            res.json(result);
        } else {
            res.json({message: 'Não encontrado pedido.'});
        }
    });

});

router.post('/confirmation', async (req, res) => {
    let { email, template } = req.body;

    template = JSON.parse(template)

    const draft = mailer.drafts.build({
        subject: "Confirmação novo pedido",
        body: template,
        to: [{name: email, email: email}],
        bcc: [{name: email, email: "kjesus@gmail.com"}]
    });
    draft.send().then();
});

router.post('/new', async (req, res) => {
    let { userId, products } = req.body;

    if (userId !== null && userId > 0) {

        database.query(`insert into orders (user_id) values (${userId})`, (err, ret) => {

            if (ret.insertId > 0) {
                products.forEach(async (p) => {

                    await database.query(`select title, price, quantity from products where id = ${p.id}`, (err, data) => {

                    let inCart = parseInt(p.incart);

                    if (data.quantity > 0) {
                        data.quantity = data.quantity - inCart;

                        if(data.quantity < 0) {
                            data.quantity = 0;
                        }

                    } else {
                        data.quantity = 0;
                    }

                    database.query(`insert into orders_details (order_id, product_id, quantity) 
                        values (${ret.insertId}, ${p.id}, ${inCart})`, (err, ord) => {
                            database.query(`update products set quantity = ${data.quantity} where id = ${p.id}`)
                        });
                    });


                });
            } else {
                res.json({message: 'O novo pedido falhou ao adicionar detalhes do pedido', success: false});
            }

            res.json({
                message: `Pedido feito com sucesso com id de pedido ${ret.insertId}`,
                success: true,
                order_id: ret.insertId,
                products: products
            });

        })
        
    } else {
        res.json({message: 'Novo pedido falhou.', success: false});
    }

});

router.post('/payment', (req, res) => {
    setTimeout(() => {
        res.status(200).json({success: true});
    }, 3000)
});

module.exports = router;