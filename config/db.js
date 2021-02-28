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

const dbUrl = (type = 'online') => {
  switch (type) {
    case 'local':
      return `mongodb://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PWD}@localhost:27017/${process.env.MONGO_DB_NAME}?authSource=admin`
    case 'online':
      return process.env.DB_AUTH_URL
  }
} 
exports.connectMongoDb = async () => {
  try {
    await mongoose
    .connect(dbUrl(process.env.DB_ORIGIN || 'online'),
      { useNewUrlParser: true, useUnifiedTopology: true }
    )
    console.log("Mongo Databse connected");
  } catch (error) {
      console.error("Error occured when trying to connect Mongo database : ", error);
  }
};


