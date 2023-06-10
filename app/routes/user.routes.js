const authJwt = require("../middleware/auth.jwt");
module.exports = (app) => {
  const user_controller = require("../controllers/user.controller");
  var router = require("express").Router();
  router.post("/signup", user_controller.createNew);
  router.get("/:us", user_controller.validUsername);
  router.post("/login", user_controller.login);
  router.get("/", authJwt, user_controller.getAllUsers);
  router.put("/:id", authJwt, user_controller.updateUser);
  router.delete("/:id", authJwt, user_controller.deleteUser);
  // For multiple parameter seperate by /
  // "/:id/:name" => req.params.id, req.params.name
  app.use("/api/auth", router);
};
