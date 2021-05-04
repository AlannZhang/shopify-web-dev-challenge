const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const serverless = require('serverless-http');
const nominationsRouter = require('./routes/nominations');
const app = express();
const connection = mongoose.connection;
require('dotenv').config({path: '../.env'});

app.use(cors());
app.use(express.json());

const connectToDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_ATLAS_URI, {useNewUrlParser: true, useUnifiedTopology: true});
  } catch (error) {
    console.error(error);
  }
}

connectToDb();

connection.once('open', {useUnifiedTopology: true}, () => {
  console.log('Connected to MongoDB database');
});

app.use('/.netlify/functions/server', nominationsRouter);

module.exports.handler = serverless(app);
