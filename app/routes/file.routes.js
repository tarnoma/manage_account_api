module.exports = app => {
    const file_controller = require("../controllers/file.controller");
    var router = require("express").Router();
    router.post("/upload", file_controller.upload);
    // router.get("/", file_controller.getListFiles);
    router.get("/:name", file_controller.download);
    app.use("/api/file", router);
};