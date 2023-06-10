const sql = require("./db.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const scKey = require("../config/jwt.config");
const fs = require("fs");

//Constructor
const User = function (user) {
  this.fullname = user.fullname;
  this.email = user.email;
  this.username = user.username;
  this.password = user.password;
  this.img = user.img;
};
const expireTime = "2h"; //default in seconds 60, if hour in "2h"

// Prevent SQLInjection by using bind params with ?
User.create = (newUser, result) => {
  sql.query("INSERT INTO tblusers SET ?", newUser, (err, res) => {
    if (err) {
      console.log("Query error: ", err);
      result(err, null);
      return;
    }
    const token = jwt.sign({ id: res.insertId }, scKey.secret, {
      expiresIn: expireTime,
    });
    console.log("Created user: ", {
      id: res.insertId,
      ...newUser,
      accessToken: token,
    });
    result(null, { 
      id: res.insertId, 
      ...newUser, 
      accessToken: token });
  });
};

User.checkUsername = (username, result) => {
  sql.query("SELECT * FROM tblusers WHERE username ='" + username + "'",(err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
      if (res.length) {
        console.log("found username: ", res[0]);
        //return the first row
        result(null, res[0]);
        return;
      }
      result({ kind: "not_found" }, null);
    }
  );
};

User.login = (account, result) => {
  sql.query("SELECT * FROM tblusers WHERE username ='" + account.username + "'",(err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
      if (res.length) {
        const validPassword = bcrypt.compareSync(
          account.password,
          res[0].password
        );
        if (validPassword) {
          const token = jwt.sign({ id: res.insertId }, scKey.secret, {
            expiresIn: expireTime,
          });
          console.log("Login Success. Token was generated.");
          console.log("CreateToken: " + token);
          res[0].accessToken = token;
          result(null, res[0]);
          return;
        } else {
          console.log("Password not match.");
          result({ kind: "invalid_pass" }, null);
          return;
        }
      }
      result({ kind: "not_found" }, null);
    }
  );
};

User.getAllRecords = (result) => {
  sql.query("SELECT * FROM tblusers", (err, res) => {
    if (err) {
      console.log("Query error: ", err);
      result(err, null);
      return;
    }
    result(null, res);
  });
};

const removeOldFileName = (id, result) => {
  sql.query("SELECT * FROM tblusers WHERE id =?", [id], (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    if (res.length) {
      let filepath = __basedir + "/assets/uploads/" + res[0].img;
      try {
        if (fs.existsSync(filepath)) {
          fs.unlink(filepath, (error) => {
            if (error) console.log("Error:" + error);
            else console.log("File: " + res[0].img + " was removed.");
          });
        } else console.log("File " + res[0].img + " not found.");
        return;
      } catch (e) {
        console.log("e: " + e);
        return;
      }
    }
    result(null, res);
  });
};

User.updateByID = (id, data, result) => {
  removeOldFileName(id);
  sql.query("UPDATE tblusers SET fullname = ?, email = ?, img = ? WHERE id = ?",
    [data.fullname, data.email, data.img, id], (err, res) => {
      if (err) {
        console.log("error: " + err);
        result(err, null);
        return;
      }
      if (res.affedtedRows == 0) {
        //not found this id
        result({ kind: "not_found" }, null);
        return;
      }
      console.log("Updated user: ", { id: id, ...data });
      result(null, { id: id, ...data });
    }
  );
};

User.remove = (id, result) => {
  removeOldFileName(id);
  sql.query("DELETE FROM tblusers WHERE id = ?", id, (err, res) => {
    if (err) {
      console.log("Query error: ", err);
      result(err, null);
      return;
    }
    if (res.affectedRows == 0) {
      result({ kind: "not_found" }, null);
      return;
    }
    console.log("Deleted user id: ", id);
    result(null, {id: id});
  });
};

module.exports = User;
