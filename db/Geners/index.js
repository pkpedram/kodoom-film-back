const mongoose = require('mongoose')

const genreSchema = new mongoose.Schema({
    title: {
        type: "string",
        required: true
    }

})

const Genre = mongoose.model('Genre', genreSchema)

module.exports = Genre