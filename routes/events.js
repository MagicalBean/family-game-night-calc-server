const router = require('express').Router();
let Event = require('../schema/events.model');

router.route('/all').get((req, res) => {
  Event.find()
    .then((events) => res.json(events))
    .catch((err) => res.status(400).json('Error: ' + err));
});

router.route('/remove').delete((req, res) => {
  Event.deleteOne({ _id: req.body.id }, (err) => {
    if (!err) res.status(200).json('Success!');
    else res.status(400).json('Error: ' + err);
  });
});

router.route('/add').post((req, res) => {
  const game = req.body.game;
  const time = new Date(req.body.time);

  const newEvent = new Event({ event: game, time });

  newEvent
    .save()
    .then(() => res.json('Event Added'))
    .catch((err) => res.status(400).json('Error: ' + err));
});

module.exports = router;
