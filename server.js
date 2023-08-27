const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

global.__basedir = __dirname;
//for vercel only
// global.file_url = "https://drive.google.com/drive/folders/12Krqh3Wd82OwWYNXSWWpQROiI5h0M_lJ?usp=sharing";
var corsOptions = {
  origin: "*",
};
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("/var/task/assets/uploads/"));

app.get("/", (req, res) => {
  res.json({ message: "Welcome to Manage Accounts API." });
});
require("./app/routes/file.routes")(app);
require("./app/routes/user.routes")(app);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
