const express = require("express");
const dotenv = require("dotenv");
const router = require("./routes/index.router");
const cors = require("cors");
const bodyParser = require("body-parser");

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(cors());

var corsOptions = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

// routes from /flightSearch will be routed to index.router
app.use("/flights", router);

// starting the  the server
app.listen(process.env.BACKEND_PORT, () => {
  console.log(
    `server running : http://${process.env.BACKEND_HOST}:${process.env.BACKEND_PORT}`
  );
});
