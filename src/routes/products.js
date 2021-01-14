const express = require('express');
const router = express.Router();
const {database} = require('../config/helpers');

/**
 * Sending Page Query Parameter is mandatory http://localhost:3000/api/products?page=1
 */

router.get('/', function (req, res) {       
    let page = (req.query.page !== undefined && req.query.page !== 0) ? req.query.page : 1;
    const limit = (req.query.limit !== undefined && req.query.limit !== 0) ? req.query.limit : 10;   // set limit of items per page
    let startValue;
    let endValue;
    if (page > 0) {
        startValue = (page * limit) - limit;     // 0, 10, 20, 30
        endValue = page * limit;                  // 10, 20, 30, 40
    } else {
        startValue = 0;
        endValue = 10;
    }

    database.query("select c.title as category," +
    "p.title as name," +
    "p.price," +
    "p.quantity," +
    "p.description," +
    "p.image," +
    "p.id from products p " +
    "join categories c " +
    "on p.cat_id = c.id " + 
    "order by id", (err, prods) => {
        if (prods) {
            return res.status(200).json({
                products: prods
            });
        } else {
            return res.json(err);
        }
    });
   
});

router.get('/:prodId', (req, res) => {
    let productId = req.params.prodId;
    database.query(`select distinct c.title as category,
    p.title as name,
    p.price,
    p.quantity,
    p.description,
    p.images,
    p.image,
    p.id from products p 
    join categories c 
    on p.cat_id = c.id
    where p.id = ${productId} 
    order by id`, (err, prods) => {
        if (prods) {
            return res.status(200).json({
                product: prods[0]
            });
        } else {
            return res.json(err);
        }
    });
});

router.get('/category/:catName', (req, res) => {
    let page = (req.query.page !== undefined && req.query.page !== 0) ? req.query.page : 1;
    const limit = (req.query.limit !== undefined && req.query.limit !== 0) ? req.query.limit : 10;

    let startValue;
    let endValue;
    if(page > 0) {
        startValue = (page * limit) - limit;
        endValue = page * limit;
    } else {
        startValue = 0;
        endValue = 10;
    }

    const cat_title = req.params.catName;

    database.query(`select c.title as category,
    p.title as name,
    p.price,
    p.quantity,
    p.description,
    p.image,
    p.id from products p 
    join categories c 
    on p.cat_id = c.id
    where c.title like '%${cat_title}%' order by id`, (err, prods) => {
        if (prods) {
            return res.status(200).json({
                products: prods
            });
        } else {
            return res.json({message: `Nenhum produto encontrado com essa categoria: ${cat_title}`});
        }
    });

});

router.post('/register', async (req, res) => {
    let name = req.body.name;
    let category = req.body.category;
    let description = req.body.description;
    let image = req.body.image;
    let price = req.body.price;
    let quantity = req.body.quantity;

    let sql = `insert into products (title,
        image,
        description,
        price,
        quantity,
        short_desc,
        cat_id) values (
        '${name}',
        '${image}',
        '${description}',
        '${price}',
        ${quantity},
        '${category}',
        ${1})`

    database.query(sql, (err, result) => {
            if(result) {
                return res.json({ success: true, message: 'Produto cadastrado com sucesso.' }); 
            } else {
                return res.json({ success: false, message: 'Produto não cadastrado.' }); 
            }
    });
   
});

router.delete('/:Id', (req, res) => {
    let id = req.params.Id;
    database.query(`delete from products where id = ${id}`, (err, result) => {
        if (result) {
            res.json({ success: true, message: 'Produto excluído com sucesso.' });
        } else {
            res.json({ success: false, message: 'Produto não excluído.' });
        }
    });
});

module.exports = router;