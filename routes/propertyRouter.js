const express = require('express');
const Property = require('../models/property');

const propertyRouter = express.Router();

propertyRouter.route('/')
.get((req, res, next) => {
    Property.find()
    .then(properties => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(properties);
    })
    .catch(err => next(err));
})
.post((req, res, next) => {
    Property.create(req.body)
    .then(property => {
        console.log('Property Created ', property);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(property);
    })
    .catch(err => next(err));
})
.put((req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /properties');
})
.delete((req, res, next) => {
    Property.deleteMany()
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});

propertyRouter.route('/:propertyId')
.get((req, res, next) => {
    Property.findById(req.params.propertyId)
    .then(property => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(property);
    })
    .catch(err => next(err));
})
.post((req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /properties/${req.params.propertyId}`);
})
.put((req, res, next) => {
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
.delete((req, res, next) => {
    Property.findByIdAndDelete(req.params.propertyId)
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});

propertyRouter.route('/:propertyId/comments')
.get((req, res, next) => {
    Property.findById(req.params.propertyId)
    .then(property => {
        if (property) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(property.comments);
        } else {
            err = new Error(`Property ${req.params.propertyId} not found`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
})
.post((req, res, next) => {
    Property.findById(req.params.propertyId)
    .then(property => {
        if (property) {
            property.comments.push(req.body);
            property.save()
            .then(property => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(property);
            })
            .catch(err => next(err));
        } else {
            err = new Error(`Property ${req.params.propertyId} not found`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
})
.put((req, res) => {
    res.statusCode = 403;
    res.end(`PUT operation not supported on /properties/${req.params.propertyId}/comments`);
})
.delete((req, res, next) => {
    Property.findById(req.params.propertyId)
    .then(property => {
        if (property) {
            for (let i = (property.comments.length-1); i >= 0; i--) {
                property.comments.id(property.comments[i]._id).remove();
            }
            property.save()
            .then(property => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(property);
            })
            .catch(err => next(err));
        } else {
            err = new Error(`Property ${req.params.propertyId} not found`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
});



module.exports = propertyRouter;

