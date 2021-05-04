const router = require('express').Router();
const axios = require('axios');
const Nomination = require('../models/nominationModel');
require('dotenv').config();

// retrieves movies from omdb
// moved omdb api call to backend due to cors issue in the frontend
// when trying to deploy with netlify
router.route('/movies/:title').get(async (req, res) => {
  try {
    const url = `http://www.omdbapi.com/?apikey=${process.env.OMDB_API_KEY}&t=${req.params.title}&type=movie&plot=full`;
    const results = await axios.get(url);
    console.log(results);
    res.send(results.data);
  } catch (error) {
    console.error(error);
  }
});

// retrieves nominations from db
router.route('/nominations').get(async (req, res) => {
  try {
    const results = await Nomination.find();
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
      posterUrl: req.body.posterUrl,
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
