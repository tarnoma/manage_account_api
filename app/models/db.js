require("dotenv").config()
const mysql = require("mysql2");
// const dbConfig = require("../config/db.config");
// // Create a connection to the database
// const connection = mysql.createConnection({
//   host: dbConfig.HOST,
//   user: dbConfig.USER,
//   password: dbConfig.PASSWORD,
//   database: dbConfig.DB,
// });

//For PlanetScale
const connection = mysql.createConnection(process.env.DATABASE_URL)


// open the MySQL connection
connection.connect((error) => {
  if (error) console.log("MySQL connection: " + error);
  else console.log("Successfully connected to the database.");
});
module.exports = connection;
