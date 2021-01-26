const express = require('express');
const Favorite = require('../models/favorite');
const authenticate = require('../authenticate');
const favoriteRouter = express.Router();
const cors = require('./cors');

favoriteRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
    .get(cors.cors,  authenticate.verifyUser, (req, res, next) => {
        Favorite.find({ user: req.user._id })
            .populate('favorite.user')
            .populate('favorite.properties')
            .then(favorites => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorites);
            })
            .catch(err => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorite.findOne({ user: req.user._id }, (err, favorite) => {
            if (err) {
                return next(err, false);
            }
            if (!err && favorite) {
                req.body.forEach(fav => {
                    console.log(`fav = ${fav._id}`);
                    console.log(`favorite.properties: ${favorite.properties}`);
                    console.log(`index of fav = ${favorite.properties.indexOf(fav)}`);
                    if (favorite.properties.indexOf(fav._id) == -1) {
                        favorite.properties.push(fav)
                    }
                })
                favorite.save((err, favorite) => {
                    if (err) {
                        return next(err, false);
                    } else {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(favorite);
                        // return next(null, favorite);
                    }
                });
            } else {
                //Didn't find favorite doc, create one
                favorite = new Favorite({ user: req.user._id });
                favorite.properties = req.body;
                favorite.save((err, favorite) => {
                    if (err) {
                        return next(err, false);
                    } else {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(favorite);
                        // return next(null, favorite);
                    }
                });
            }
        });



    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /favorites');
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorite.findOneAndDelete({ user: req.user._id })
            .then(response => {
                if (response) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(response);
                }
                else {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'text/plain');
                    res.end('You do not have any favorites to delete');
                }
            })
            .catch(err => next(err));
    });

favoriteRouter.route('/:propertyId')
    .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
    .get(cors.cors, (req, res, next) => {
        res.statusCode = 403;
        res.end(`GET operation not supported on /favorites/${req.params.propertyId}`);
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
        Favorite.findOne({ user: req.user._id })
            .then(favorite => {
                if (favorite) {
                    const i = favorite.properties.indexOf(req.params.propertyId);
                    if (i == -1) {
                        favorite.properties.push(req.params.propertyId);

                        favorite.save((err, favorite) => {
                            if (err) {
                                return next(err, false);
                            } else {
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.json(favorite);
                            }
                        });
                    }
                    else {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'text/plain');
                    res.end('That property is already a favorite!');
                    }
                }
                else {
                    favorite = new Favorite({ user: req.user._id });
                    favorite.properties = req.params.propertyId;
                    favorite.save((err, favorite) => {
                        if (err) {
                            return next(err, false);
                        } else {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(favorite);
                            // return next(null, favorite);
                        }
                    });
                }
            })
            .catch(err => next(err));
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end(`PUT operation not supported on /favorites/${req.params.propertyId}`);
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorite.findOne({ user: req.user._id })
            .then(favorite => {
                if (favorite) {
                    const i = favorite.properties.indexOf(req.params.propertyId);
                    if (i != -1) {
                        favorite.properties.splice(i, 1);

                        favorite.save((err, favorite) => {
                            if (err) {
                                return next(err, false);
                            } else {
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.json(favorite);
                            }
                        });
                    }
                    else {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'text/plain');
                    res.end('That favorite does not exist');
                    }
                }
                else {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'text/plain');
                    res.end("there are no favorites to delete");
                }
            })
            .catch(err => next(err));
    });



module.exports = favoriteRouter;

