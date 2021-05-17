const router = require('express').Router();
let Event = require('../schema/events.model');

router.route('/all').get((req, res) => {
  Event.find({})
    .sort({ date: 'desc' })
    .exec((err, events) => {
      if (err) res.status(400).json('Error: ' + err);
      else res.json(events);
    });
});

router.route('/delete').delete((req, res) => {
  Event.deleteOne({ _id: req.body.id }, (err) => {
    if (!err) res.status(200).json('Success!');
    else res.status(400).json('Error: ' + err);
  });
});

router.route('/add').post((req, res) => {
  const event = req.body.game;
  const date = new Date(req.body.date);

  const newEvent = new Event({ event, date });

  newEvent
    .save()
    .then(() => res.json('Event Added'))
    .catch((err) => res.status(400).json('Error: ' + err));
});

module.exports = router;
