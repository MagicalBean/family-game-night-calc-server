const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const EventsSchema = new Schema({
  event: String,
  date: Date,
});

const Event = mongoose.model('Events', EventsSchema);

module.exports = Event;
