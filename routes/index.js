'use strict';

const products = require('./products');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

const schema = mongoose.Schema({
    id: { type: Number },
    quantity: { type: Number },
    createdAt: { type: Date, expires: '300s', default: Date.now },
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
                    return ProductModel.update({}, {createdAt: new Date()}, {multi: true})
                        .then(() => {
                            return res.status(200).send({
                                code: 200,
                                message: 'OK'
                            });
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
            let summ = 0;
            let count = 0;
            data.map((v) => {
                const t = products.products.find(r => r.id === v.id);
                if (t) {
                    summ += v.quantity * t.price;
                    count += v.quantity
                }
            });
            if (err) return res.status(500).send({ code: 500, message: err });
            return res.status(200).send({ data: {
                total_sum: summ,
                products_count: count,
                products: data
            }});
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
        ProductModel.find({id: req.params.id}, (err, data) => {
            data = data[0];
            if (!data || data.lenght === 0) return res.status(404).send({ code: 404, message: 'Not found' });
            const query = ProductModel.find({ id: req.params.id }).remove();
            query.exec((err, data) => {
                if (err) return res.status(500).send({ code: 500, message: err });
                return ProductModel.update({}, {createdAt: new Date()}, {multi: true})
                    .then(() => {
                        return res.status(200).send({
                            code: 200,
                            message: 'OK'
                        });
                    });
            });
        });
    });
};