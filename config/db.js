const mongoose = require("mongoose");
const mysql = require('mysql');
require('dotenv').config()


exports.getConnection = async () => {
  const db = await mysql.createConnection({
    host: process.env.DB_MYSQL_HOST,
    user: process.env.DB_MYSQL_USER,
    password: process.env.DB_MYSQL_PWD,
    database: process.env.DB_MYSQL_NAME
  });
  db.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  return db;
});
}


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


