const mongoose = require('mongoose')

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    translatedTitle: {
        type: String,
    },
    summary: {
        type: String
    },
    country: {
        type: String
    },
    imdb: {
        type: Number
    },
    duration: {
        type: Number
    },
    genres: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'Genre'
    }],
    actors: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'Actor'
    }],
    directors: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'Director'
    }],
    mainPoster: {
        type: String
    },


})

const Movie = mongoose.model('Movie', movieSchema)

module.exports = Movie