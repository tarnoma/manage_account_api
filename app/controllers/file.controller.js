const uploadFile = require("../middleware/upload");

const upload = async (req, res) => {
  try {
    // console.log(JSON.stringify(req.file));
    await uploadFile(req, res);
    if (req.file === undefined) {
      return res.status(400).send({ message: "Please upload a file!" });
    }
    res.status(200).send({
      message: "Uploaded the file successfully: " + req.file.filename,
      uploadFileName: req.file.filename,
    });
  } catch (err) {
    res.status(500).send({
      message: "Could not upload the file:" + err,
    });
  }
};

const getListFiles = (req, res) => {
  const directoryPath = "./assets/uploads/";
  // console.log("lis:" + directoryPath)
  fs.readdir(directoryPath, function (err, files) {
    if (err) {
      res.status(500).send({
        message: "Unable to scan files!",
      });
    }
    let fileInfos = [];
    files.forEach((file) => {
      fileInfos.push({
        name: file,
        url: baseUrl + file,
      });
    });
    res.status(200).send(fileInfos);
  });
};

const download = (req, res) => {
  const fileName = req.params.name;
  // console.log("faaaaaa:" + fileName)
  const directoryPath = "./assets/uploads/";
  res.download(directoryPath + fileName, fileName, (err) => {
    if (err) {
      res.status(500).send({
        message: __basedir +" Could not download the file. " + err,
      });
    }
  });
};

module.exports = { upload, getListFiles, download };
