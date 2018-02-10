var mongoose = require('mongoose');

var reviewSchema = mongoose.Schema({ 
    name: {
        type: String,
        required: true
    },
    review: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        min: 0,
        max: 5
    },
    createdOn: {
        type: Date,
        default: Date.now
    }
});

var roomSchemna = mongoose.Schema({ 
    type: String,
    number: Number,
    description: String,
    photos: [String],
    price: Number
});

var hotelSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: String,
    stars: {
        type: Number,
        min: 0,
        max: 5,
        default: 0,
    },
    currency: String,
    services: [String],
    photos: [String],
    reviews: [reviewSchema],
    rooms: [roomSchemna],
    location: {
        address: String,
        coordinates: {
            type: [Number],
            index: '2dsphere'
        }
    }
});

mongoose.model('Hotel', hotelSchema);