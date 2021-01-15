const express = require('express');
const bodyParser = require('body-parser');
const multipart = require('connect-multiparty');
const logger = require('morgan');
const cors = require('cors');
const path = require('path');

const app = express();

const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

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