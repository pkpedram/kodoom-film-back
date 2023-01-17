const mongoose = require('mongoose')

const actorSchema = new mongoose.Schema({
    fullName: {
        type: "string",
        required: true,
    },
    image: {
        type: "string"
    },

})

const Actor = mongoose.model('Actor', actorSchema)

module.exports = Actor