const mongoose = require("mongoose");

const MONGO_URL = "mongodb+srv://nasa-api:Einstein5914@nasacluster.50aizao.mongodb.net/nasa?retryWrites=true&w=majority";

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
