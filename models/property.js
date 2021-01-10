const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;


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
        type: Currency,
        required: true
    },
    lat: {

    },
    long: {

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