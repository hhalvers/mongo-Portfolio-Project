const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const propertySchema = new Schema({
    address: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    img: {
        type: String,
        required: true
    },
    rent: {
        type: Boolean,
        required: true
    },
    longDescription: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    lat: {

    },
    lng: {

    },
    beds: {
        type: String,
        required: true
    },
    baths: {
        type: String,
        required: true
    },
    photos: 
         [String]
    
}, {
    timestamps: true
});

const Property = mongoose.model('Property', propertySchema);

module.exports = Property;