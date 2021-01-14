const path = require('path');
const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');

const Nylas = require('nylas');

const { clientId, clientSecret, token } = require('../config/mail.json');

Nylas.config({
  clientId: clientId,
  clientSecret: clientSecret
});

const nylas = Nylas.with(token);

module.exports = nylas;