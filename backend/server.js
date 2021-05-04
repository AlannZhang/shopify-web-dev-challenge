const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const serverless = require('serverless-http');
require('dotenv').config({path: '../.env'})
const nominationsRouter = require('./routes/nominations');
const app = express();
// const port = 8000;
const connection = mongoose.connection;

app.use(cors());
app.use(express.json());

const connectToDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_ATLAS_URI);
  } catch (error) {
    console.error(error);
  }
}

connectToDb();

connection.once('open', () => {
  console.log('Connected to MongoDB database');
})

app.use('/.netlify/functions/server', nominationsRouter);  // path must route to lambda
// app.use('/nominations', nominationsRouter);

/*
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
*/

module.exports = app;
module.exports.handler = serverless(app);
