const express = require('express');
const Property = require('../models/property');
const authenticate = require('../authenticate');
const cors = require('./cors');


const propertyRouter = express.Router();

propertyRouter.route('/')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, (req, res, next) => {
    Property.find()
    .then(properties => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(properties);
    })
    .catch(err => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser,(req, res, next) => {
    Property.create(req.body)
    .then(property => {
        console.log('Property Created ', property);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(property);
    })
    .catch(err => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser,(req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /properties');
})
.delete(cors.corsWithOptions, (req, res, next) => {
    Property.deleteMany()
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});

propertyRouter.route('/:propertyId')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, (req, res, next) => {
    Property.findById(req.params.propertyId)
    .then(property => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(property);
    })
    .catch(err => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser,(req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /properties/${req.params.propertyId}`);
})
.put(cors.corsWithOptions, (req, res, next) => {
    Property.findByIdAndUpdate(req.params.propertyId, {
        $set: req.body
    }, { new: true })
    .then(property => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(property);
    })
    .catch(err => next(err));
})
.delete(cors.corsWithOptions, authenticate.verifyUser,(req, res, next) => {
    Property.findByIdAndDelete(req.params.propertyId)
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});


module.exports = propertyRouter;

