var express = require('express');
var router = express.Router();

var hotelsController = require("../controllers/hotels.controller");
var reviewsController = require("../controllers/reviews.controller");
var usersController = require("../controllers/users.controller");

// AUTHENTICATION SETTING FOR API
var settings = require('../settings/appSettings');

router
    .route('/hotels')
        .get(settings.authenticateUser, hotelsController.hotelsGetAll)
        .post(settings.authenticateUser, hotelsController.hotelsAddNew);

router
    .route('/hotels/:hotelId')
        .get(settings.authenticateUser, hotelsController.hotelsGetOne)
        .put(settings.authenticateUser, hotelsController.hotelsUpdateOne)
        .delete(settings.authenticateUser, hotelsController.hotelsDeleteOne);

router
    .route('/hotels/:hotelId/reviews')
        .get(settings.authenticateUser, reviewsController.reviewsGetAll)
        .post(settings.authenticateUser, reviewsController.reviewAdd);

router
    .route('/hotels/:hotelId/reviews/:reviewId')
        .get(settings.authenticateUser, reviewsController.reviewById)
        .put(settings.authenticateUser, reviewsController.reviewUpdateOne)
        .delete(settings.authenticateUser, reviewsController.reviewDeleteOne);

router
    .route('/users/register')
        .post(usersController.register);

router
    .route('/login')
        .post(usersController.login);

module.exports = router;