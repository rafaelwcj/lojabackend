const express = require('express');
const bodyParser = require('body-parser');
const multipart = require('connect-multiparty');
const logger = require('morgan');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(function(req, res, next) {
    var oneof = false;
    if(req.headers.origin) {
        res.header('Access-Control-Allow-Origin', req.headers.origin);
        oneof = true;
    }
    if(req.headers['access-control-request-method']) {
        res.header('Access-Control-Allow-Methods', req.headers['access-control-request-method']);
        oneof = true;
    }
    if(req.headers['access-control-request-headers']) {
        res.header('Access-Control-Allow-Headers', req.headers['access-control-request-headers']);
        oneof = true;
    }
    if(oneof) {
        res.header('Access-Control-Max-Age', 60 * 60 * 24 * 365);
    }

    // intercept OPTIONS method
    if (oneof && req.method == 'OPTIONS') {
        res.send(200);
    }
    else {
        next();
    }
});

app.use(logger('combined'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const multipartMiddleware = multipart({ uploadDir: "./src/uploads/img" });
app.post('/api/upload', multipartMiddleware, (req, res) => {
    const files = req.files;
    res.json({ message: files });
});

app.get("/api/images/:image", (req, res) => {
    let image = req.params.image;
    res.sendFile(path.join(__dirname, `./uploads/img/${image}`));
});

const productsRouter = require('./routes/products');
const ordersRouter = require('./routes/order');
const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');

app.use('/api/products', productsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/users', usersRouter);
app.use('/api/auth', authRouter);

const port = process.env.port || 3000;

app.listen(port, () => {
    console.log('Escutando na porta')
});