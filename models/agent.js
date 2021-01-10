const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var mongooseTypePhone = require('mongoose-type-phone');

const agentSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    img: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: mongooseTypePhone,
        required: true
    }
}, {
    timestamps: true
});

const Agent = mongoose.model('Agent', agentSchema);

module.exports = Agent;