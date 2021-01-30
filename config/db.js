const mongoose = require("mongoose");
const mysql = require('mysql');
require('dotenv').config()

exports.connectMongoDb = async () => {
  try {
    await mongoose
    .connect(
      process.env.DB_AUTH_URL,
      { useNewUrlParser: true, useUnifiedTopology: true }
    )
    console.log("Mongo Databse connected");
  } catch (error) {
      console.error("Error occured when trying to connect Mongo database : ", error);
  }
};


