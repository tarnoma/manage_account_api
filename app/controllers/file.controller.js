const uploadFile = require("../middleware/upload");

const upload = async (req, res) => {
  try {
    // console.log(JSON.stringify(req.file));
    await uploadFile(req, res);
    if (req.file === undefined) {
      return res.status(400).send({ message: "Please upload a file!" });
    }
    res.status(200).send({
      message: "Uploaded the file successfully: " + req.file.filename + ", buff: " +req.file.buffer + ", or: " + req.file.originalname + ", mime: " + req.file.mimetype,
      uploadFileName: req.file.filename,
    });
  } catch (err) {
    res.status(500).send({
      message: "Could not upload the file:" + err,
    });
  }
};

const getListFiles = (req, res) => {
  // for local
  // const directoryPath = __basedir + "/assets/uploads/";
  // for vercel
  const directoryPath = __basedir + "/assets/uploads/";
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
  // for local
  // const directoryPath = __basedir + "/assets/uploads/";
  // for vercel, due to it is serverless
  const directoryPath = file_domain + "/assets/uploads/";
  
  res.download(directoryPath + fileName, fileName, (err) => {
    if (err) {
      res.status(500).send({
        message: directoryPath + fileName + " Could not download the file. " + err,
      });
    }
  });
};

module.exports = { upload, getListFiles, download };
