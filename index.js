const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

require('dotenv').config();

app.use(cors());
app.use(express.json());

//#region Init Mongoose

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', () => {
  console.log('MongoDB database connection established successfully');
});

//#endregion

//#region Routes

const eventsRouter = require('./routes/events');
const gamesRouter = require('./routes/games');

app.use('/events', eventsRouter);
app.use('/games', gamesRouter);

//#endregion

app.listen(port, () => {
  console.log('Listening on port ' + port);
});
