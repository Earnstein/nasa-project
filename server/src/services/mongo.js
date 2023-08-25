const mongoose = require("mongoose");
require('dotenv').config();

const config = {
  MONGO_URI: process.env.MONGO_URI,
}

const MONGO_URL = config.MONGO_URI

mongoose.connection.once("open", () => {
  console.log("Mongodb connection is ready!...");
});

mongoose.connection.on("error", (err) => {
  console.error(err);
});

async function mongoConnect() {
  await mongoose.connect(MONGO_URL);
}

async function mongoDisconnect() {
  await mongoose.disconnect;
}
module.exports = { mongoConnect, mongoDisconnect };
