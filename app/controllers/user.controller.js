const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const createNew = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  // generate salt to hash password
  const salt = bcrypt.genSaltSync(10);
  const userobj = new User({
    fullname: req.body.fullname,
    email: req.body.email,
    username: req.body.username,
    password: bcrypt.hashSync(req.body.password, salt),
    img: req.body.img,
  });

  User.create(userobj, (err, data) => {
    if (err) {
      res.status(500).send({
        message: err.message || "Some error occured while creating.",
      });
    } else res.send(data);
  });
};

const validUsername = (req, res) => {
  User.checkUsername(req.params.us, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.send({
          message: "Not found " + req.params.us,
          valid: true,
        });
      } else {
        res.status(500).send({
          message: "Error retrieving " + req.params.us,
        });
      }
    } else res.send({ record: data, valid: false });
  });
};

const login = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  const account = new User({
    username: req.body.username,
    password: req.body.password,
  });

  User.login(account, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(401).send({
          message: "Not found " + req.body.username,
        });
      } else if (err.kind === "invalid_pass") {
        res.status(401).send({ message: "Invalid Password" });
      } else {
        res.status(500).send({
          message: "Error retrieving " + req.body.username,
        });
      }
    } else res.send(data);
  });
};

const getAllUsers = (req, res) => {
  User.getAllRecords((err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving data.",
      });
    else res.send(data);
  });
};

const updateUser = (req, res) => {
  if (!req.body) {
    res.status(400).send({ message: "Content can not be empty!" });
  }
  const data = {
    fullname: req.body.fullname,
    email: req.body.email,
    img: req.body.img,
  };
  User.updateByID(req.params.id, data, (err, result) => {
    if (err) {
      if (err.kind == "not_found") {
        res.status(401).send({
          message: "Not found user id: " + req.params.id,
        });
      } else {
        res.status(500).send({
          message: "Error update user id: " + req.params.id,
        });
      }
    } else res.send(result);
  });
};

const deleteUser = (req, res) => {
  User.remove(req.params.id, (err, result) => {
    if (err) {
      if (err.kind == "not_found") {
        res.status(401).send({
          message: "Not found user id: " + req.params.id,
        });
      } else {
        res.status(500).send({
          message: "Error delete user id: " + req.params.id,
        });
      }
    } else res.send(result);
  });
};

module.exports = {
  createNew,
  validUsername,
  login,
  getAllUsers,
  updateUser,
  deleteUser,
};
