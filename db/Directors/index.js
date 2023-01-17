const mongoose = require('mongoose')

const directorsSchema = new mongoose.Schema({
    fullName: {
        type: "string",
        required: true,
    },
    image: {
        type: "string"
    },

})

const Director = mongoose.model('Director', directorsSchema)

module.exports = Director