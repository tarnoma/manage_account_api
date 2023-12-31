const util = require("util");
const multer = require("multer");
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     // for local
//     // cb(null, __basedir + "/assets/uploads/");
//     // for vercel
//     cb(null, __basedir + "/assets/uploads/" );
//   },
//   filename: (req, file, cb) => {
//     const extArray = file.mimetype.split("/");
//     const extension = extArray[extArray.length - 1];
//     const newFileName = `FileUpload-${Date.now()}.${extension}`;
//     cb(null, newFileName);
//   },
// });

const storage = multer.memoryStorage();

//"singlefile" is an element name in the multipart/form-data
const uploadFile = multer({ storage: storage }).single("singlefile");
// const uploadFile = multer({  dest: "uploads/" }).single("singlefile");

//util.promisify() makes the exported middleware object can be used with async-await
const uploadFileMiddleware = util.promisify(uploadFile);
module.exports = uploadFileMiddleware;
