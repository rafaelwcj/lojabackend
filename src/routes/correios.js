
var express = require('express');
var router = express.Router();

const APIcorreios = require('node-correios');
const correios = new APIcorreios();

router.get('/frete/:cep', (req, res) => {
    let cepDestino = req.params.cep;
    if(cepDestino !== ''){
        let args = {
            nCdServico: '04014', // SEDEX à vista 
            sCepOrigem: '04447020',
            sCepDestino: cepDestino,
            nVlPeso: 1, // Até 1Kg
            nCdFormato: 1, // Caixa/Pacote
            nVlComprimento: 30,
            nVlAltura: 8,
            nVlLargura: 10,
            nVlDiametro: 18
        };
        correios.calcPreco(args).then(resul => {
            return res.json(resul);
        }).catch(error => {
            return res.json(error);
        });
    }
});

router.post('/consultaCep', (req, res) => {
    let cep = req.body.cep;
    correios.consultaCEP({ cep: cep }).then(resul => {
        return res.json(resul);
    }).catch(error => {
        return res.json(error);
    });
});

module.exports = router;