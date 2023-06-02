const express = require("express");
const dotenv = require("dotenv");
const router = require("./routes/index.router");

dotenv.config();

const app = express();

// routes from /flightSearch will be routed to index.router
app.use("/flights", router);

// starting the  the server
app.listen(process.env.BACKEND_PORT, () => {
  console.log(
    `server running : http://${process.env.BACKEND_HOST}:${process.env.BACKEND_PORT}`
  );
});
