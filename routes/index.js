'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

const schema = mongoose.Schema({
    id: {
        type: Number
    },
    quantity: {
        type: Number
    }
});
const ProductModel = mongoose.model('ProductModel', schema);

mongoose.connect('mongodb://localhost/basket');

module.exports = function (app) {

    // Method for add new products to basket
    app.post('/api/cart', (req, res) => {
        ProductModel.find({id: req.body.id}, (err, data) => {
            if (err) return res.status(500).send({ code: 500, message: err });            
            data = data[0];
            if (!data) {
                const product = new ProductModel({
                    id: req.body.id,
                    quantity: req.body.quantity
                });
                return product.save().then(() => {
                    return res.status(200).send({
                        code: 200,
                        message: 'OK'
                    });
                });
            }
            return ProductModel.update({id: req.body.id}, {quantity: req.body.quantity})
                .then(() => {
                    return res.status(200).send({
                        code: 200,
                        message: 'OK'
                    });
                })
                .catch((err) => {
                    console.log(err);
                    return res.status(500).send({
                        code: 500,
                        message: err
                    });
                });
        });
    });

    // Method to get all basket
    app.get('/api/products', (req, res) => {
        const query = ProductModel.find({}).select('id quantity -_id');
        query.exec((err, data) => {
            if (err) return res.status(500).send({ code: 500, message: err });
            return res.status(200).send({ data });
        });
    });

    // Full clear basket method
    app.delete('/api/cart/clear', (req, res) => {
        const query = ProductModel.remove({});
        query.exec((err, data) => {
            if (err) return res.status(500).send({ code: 500, message: err });
            return res.status(200).send({ code: 200, message: 'OK' });
        });
    });

    // Method to delete product by id from basket
    app.delete('/api/cart/:id', (req, res) => {
        const query = ProductModel.find({ id: req.params.id }).remove();
        query.exec((err, data) => {
            if (err) return res.status(500).send({ code: 500, message: err });
            return res.status(200).send({ code: 200, message: 'OK' });
        });
    });
};