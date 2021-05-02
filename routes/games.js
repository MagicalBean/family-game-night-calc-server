const router = require('express').Router();
let Games = require('../schema/games.model');

router.route('/all').get((req, res) => {
  Games.find()
    .then((games) => res.json(games))
    .catch((err) => res.status(400).json('Error: ' + err));
});

router.route('/remove').delete((req, res) => {
  Games.findOneAndUpdate({}, { $pull: { games: req.body.game } }, { new: true })
    .then((games) => res.json(games))
    .catch((err) => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
  const game = req.body.game;

  Games.find().then((games) => {
    if (games.length === 0) CreateGamesDocument();
  });

  Games.findOneAndUpdate({}, { $addToSet: { games: game } }, { new: true })
    .then((games) => res.json(games))
    .catch((err) => res.status(400).json('Error: ' + err));
});

CreateGamesDocument = () => {
  const games = new Games({ games: [] });

  games
    .save()
    .then(() => console.log('Games Inited'))
    .catch((err) => console.err('Error: ' + err));
};

module.exports = router;
