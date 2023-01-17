const express = require('express');
const PORT = 4200;
const cors = require('cors')
const app = express()
const path = require('path')

const mongoose = require('mongoose');
const actorRouter = require('./routes/actors');
const directorRouter = require('./routes/directors');

const connectDB =  async () => {
  
      await  mongoose.connect('mongodb://127.0.0.1:27017/kodoomFilm');
      console.log('DATABASE CONNECTED')

}

app.use(cors())
app.use(express.json())
app.use('/actors', actorRouter)
app.use('/directors', directorRouter)
app.use('/media', express.static(path.join(__dirname, 'media')))




app.listen(PORT, () => {
    console.log('server is Up in port', PORT)
   connectDB().catch(err => console.error(err))
})