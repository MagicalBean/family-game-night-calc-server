const mongoose = require('mongoose');

const Schema = mongoose.Schema;

('Splendor,Hogwarts Battle,Harry Potter Clue,Colt Express,Pictionary,The Game of Life,Apples to Apples,Ticket to Ride,Smallworld,Monopoly,Catan,Flashpoint,Pandemic,Jenga,Carcassonne,Fabled Fruit,Clue,Forbidden Island,Forbidden Desert,Mystic Market,D&D');

const GamesSchema = new Schema({
  games: [],
});

const Games = mongoose.model('Games', GamesSchema);

module.exports = Games;
