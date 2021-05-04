const router = require('express').Router();
const axios = require('axios');

// retrieves movies from omdb
// moved omdb api call to backend due to cors issue in the frontend
// when trying to deploy withnetlify
router.route('/movies/:title').get(async (req, res) => {
  try {
    const results = await axios.get(`http://www.omdbapi.com/?apikey=${process.env.REACT_APP_OMDB_API_KEY}&t=${req.body.movieTitle}&type=movie&plot=full`);
    console.log(results);
    res.send(results.data);
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;
