const router = require('express').Router();
const axios = require('axios');
require('dotenv').config({path: '../.env'});

// retrieves movies from omdb
// moved omdb api call to backend due to cors issue in the frontend
// when trying to deploy withnetlify
router.route('/movies/:title').get(async (req, res) => {
  try {
    const url = `http://www.omdbapi.com/?apikey=${process.env.OMDB_API_KEY}&t=${req.params.movieTitle}&type=movie&plot=full`;
    const results = await axios.get(url);
    console.log(results);
    res.send(results.data);
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;
