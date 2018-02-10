var mongoose = require('mongoose');
var Hotel = mongoose.model('Hotel');

const _addReview = (req, res, hotel) => {
    hotel.reviews.push({
        name: req.body.name,
        review: req.body.review,
        rating: parseInt(req.body.rating)
    });

    hotel.save(function(err, hotelUpdated){
        if(err){
            return res.status(500).json(err.errors);
        }else {
            res
                .status(200)
                .json(hotelUpdated.reviews[hotelUpdated.reviews.length -1]);
        }
    });
};

module.exports.reviewsGetAll = function(req, res) {
    var hotelId = null;
    if(req.params && req.params.hotelId){
        hotelId = req.params.hotelId;
    }

    Hotel.findById(hotelId).exec(function(err, hotel){
        return res.json(hotel.reviews);
    });

};

module.exports.reviewById = function(req, res) {    
    var hotelId = null,
     reviewId = null;

    if(req.params && req.params.hotelId){
        hotelId = req.params.hotelId;
    }

    if(req.params && req.params.reviewId){
        reviewId = req.params.reviewId;
    }

    Hotel.findById(hotelId).exec(function(err, hotel){
        if(!hotel)
            return res.sendStatus(404);        
        var review = hotel.reviews.id(reviewId);
        
        if( !review )
            return res.sendStatus(404);
        
            res.status(200).json(review);
    });
};

/**
 * 
 * @param {Request} req
 * @param {Response} res
 */
module.exports.reviewAdd = function(req, res){
    var hotelId = req.params.hotelId;

    Hotel
        .findById(hotelId, function(error, doc){
            if(error){
                return res.status(500).json(error.message);
            }else if( !doc ) {
                return res
                        .status(404)
                        .json({ message: "Hotel Not Found" });
            }

            _addReview(req,res, doc);
        });
}

/**
 * 
 * @param {Request} req
 * @param {Response} res
 */
module.exports.reviewUpdateOne = function(req, res){
    var hotelId = req.params.hotelId;
    var reviewId = req.params.reviewId;

    Hotel
        .findById(hotelId, function(error, hotel){
            // ERROR OCCURED
            if(error){
                return res.status(500).json(error.message);
            }else if( !hotel ) {
                // HOTEL NOT FOUND
                return res
                        .status(404)
                        .json({ message: "Hotel Not Found" });
            }
            // GET REVIEW FROM HOTEL
            var updateReview = hotel.reviews.id(reviewId);
            updateReview.name = req.body.name;
            updateReview.review =  req.body.review;
            updateReview.rating = parseInt(req.body.rating);

            // SAVE UPDATED HOTEL
            hotel
            .save(function(err, hotelUpdated){
                if(err){
                    return res.status(500).json(err.message);
                }else  {
                    return res
                            .status(200)
                            .json(hotelUpdated.reviews.id(reviewId));
                }
            });
        });
}

/**
 * 
 * @param {Request} req
 * @param {Response} res
 */
module.exports.reviewDeleteOne = function(req, res){
    var hotelId = req.params.hotelId;
    var reviewId = req.params.reviewId;

    Hotel
        .findById(hotelId, function(error, hotel){
            // ERROR OCCURED
            if(error){
                return res.status(500).json(error.message);
            }else if( !hotel ) {
                // HOTEL NOT FOUND
                return res
                        .status(404)
                        .json({ message: "Hotel Not Found" });
            }
            // REMOVE REVIEW FROM HOTEL
            hotel.reviews.id(reviewId).remove();
            // SAVE UPDATED HOTEL
            hotel
            .save(function(err, hotelUpdated){
                if(err){
                    return res.status(500).json(err.message);
                }else  {
                    return res
                            .status(200)
                            .json({ message: "Review deleted succesfully" });
                }
            });
        });
}