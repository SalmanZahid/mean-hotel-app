var mongoonse = require('mongoose');
var Hotel = mongoonse.model('Hotel')
var ObjectId = require('mongodb').ObjectId;

const runGeoQuery = (req, res) => {
    var latitude = parseFloat(req.query.lat);
    var longitude = parseFloat(req.query.lng);

    console.log(latitude,longitude);
    // A geoJSON point
    var point = {
        type: 'Point',
        cordinates: [longitude,latitude]
    };

    var geoOptions = {
        geoSearch: "Point",
        near: [ -73.9667, 40.78 ],
    };

    Hotel
    .geoSearch( geoOptions, function(error, results, stats){
        console.log("Stats :", stats);
        console.log("Results :", results);

        res.json(results);
    });
};

/**
 * 
 * @param {String} input 
 */
const splitArray = input => {
    var output;

    if(input && input.length > 0){
        output = input.split(";");
    }

    return output;
}


/**
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
module.exports.hotelsGetAll = (req, res) => {
    var offset = 0;
    var count = 5;

    // if(req.query && req.query.lat && req.query.lng){
    //     runGeoQuery(req,res);
    //     return;
    // }

    if(req.query && req.query.offset){
        offset = parseInt(req.query.offset,10);
    }

    if(req.query && req.query.count){
        count = parseInt(req.query.count,10);
    }

    Hotel
        .find()
        .skip(offset)
        .limit(count)
        .exec(function(err, hotels) {
            if( err ) {
                console.log(err);
                res.sendStatus(500);
            }

            res.json(hotels);
    });
}

module.exports.hotelsGetOne = (req, res) => {    
    const hotelId = req.params.hotelId;

    Hotel.findById(hotelId, function(err, hotel){
        if( err ) {
            console.log(err.message);
            return res.sendStatus(500);
        }else if (hotel){
            return res.json(hotel)
        }
         
        res.sendStatus(404);
        
    });
}

module.exports.hotelsAddNew = (req, res) => {
    Hotel.create({
        name: req.body.name,
        description: req.body.description,
        stars: parseInt(req.body.stars,10),
        currency: parseInt(req.body.currency,10),
        services: splitArray(req.body.services),
        location: {
            address: req.body.address,
            coordinates: [ 
                parseFloat(req.body.lat),
                parseFloat(req.body.lng)
            ]
        }
    },function(err, hotel){
        if(err){
            console.log("Error creating hotel");
            res
                .status(400)
                .json(err);
        }else {
            console.log("Hotel has been created succesfully");
            res
                .status(201)
                .json(hotel);
        }
    })
}

module.exports.hotelsUpdateOne = (req, res) => {
    Hotel.findByIdAndUpdate(req.params.hotelId,
     {
         $set: {
            name: req.body.name,
            description: req.body.description,
            stars: parseInt(req.body.stars,10),
            currency: parseInt(req.body.currency,10),
            services: splitArray(req.body.services),
            location: {
                address: req.body.address,
                coordinates: [ 
                    parseFloat(req.body.lat),
                    parseFloat(req.body.lng)
                ]
            }
        }
     },function(err, hotel){
        if(err){
            console.log("Error Updating hotel");
            res
                .status(500)
                .json(err);
        }else if( !hotel ){
            console.log("Hotel Not Found");
            res
                .status(404)
                .json({ message: "Id doesnot exists"});
        }else {
            console.log("Hotel has been created succesfully");
            res
                .status(200)
                .json(hotel);
        }
    });
}

module.exports.hotelsDeleteOne = (req, res) => {
    if( req.params && req.params.hotelId ){
        console.log("Delete");
        Hotel.findByIdAndRemove(req.params.hotelId,
            function(err, hotel){
                if(err){
                    console.log("Error Deleting Hotel With Id", req.params.hotelId);
                    res
                        .status(500)
                        .json(err);
                }else {
                    console.log("Hotel has been created succesfully");
                    res
                        .status(200)
                        .json(hotel);
                }
        });
    }
}