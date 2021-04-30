const router = require('express').Router();
let Nomination = require('../models/nominationModel');

router.route('/').get(async (req, res) => {
  try {
    const results = await Nomination.find();
    console.log(results);
    res.send(results);
  } catch (error) {
    console.error(error);
  }
});

router.route('/add').post(async (req, res) => {
  try {
    const newNomination = new Nomination ({
      title: req.body.title,
      year: req.body.year,
    });

    const results = await newNomination.save();
    console.log(results);
    res.send('Succesfully added new nomination');
  } catch (error) {
    console.error(error);
  }
});

router.route('/delete/:id').delete(async (req, res) => {
  try {
    const results = await Nomination.findByIdAndDelete(req.params.id);
    console.log(results);
    res.send('Succesfully deleted nomination');
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;
