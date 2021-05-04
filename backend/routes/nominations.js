const router = require('express').Router();
let Nomination = require('../models/nominationModel');

// retrieves nominations from db
router.route('/nominations').get(async (req, res) => {
  try {
    const results = await Nomination.find();
    console.log(results);
    res.send(results);
  } catch (error) {
    console.error(error);
  }
});

// adds nominations to db
router.route('/nominations/add').post(async (req, res) => {
  try {
    const newNomination = new Nomination ({
      title: req.body.title,
      year: req.body.year,
      rating: req.body.rating,
      plot: req.body.plot,
    });

    await newNomination.save();
    res.send('Succesfully added new nomination');
  } catch (error) {
    console.error(error);
  }
});

// deletes nominations from db
router.route('/nominations/delete/:id').delete(async (req, res) => {
  try {
    await Nomination.findByIdAndDelete(req.params.id);
    res.send('Succesfully deleted nomination');
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;
