const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    id: {
        Number
    },
    name: {
        type: String,
        required: true,
        max: 255,
        min: 6
    },
    email: {
        type: String,
        required: true,
        max: 255,
        min: 6
    },
    password: {
        type: String,
        required: true,
        max: 1024,
        min: 6
    },
    gender: { type: String },
    dateOfBirth: { type: Date, required: true },
    knownAs: { type: String },
    photos: [String],
    favAuthor: [String],
    favBook: [String],
    favFilm: [String],
    favDirector: [String],
    favBand: [String],
    favCuisine: [String],
    lastActive: { type: Date },
    introduction: { type: String, default: 'No description...' },
    lookingFor: { type: String, default: 'No description...' }

});


module.exports = mongoose.model('users', userSchema);