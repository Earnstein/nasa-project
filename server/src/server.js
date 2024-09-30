const http = require("http");
const fs = require("fs");
require('dotenv').config();

const { mongoConnect } = require("./services/mongo");
const app = require("./app");
const { loadPlanetsData } = require("./models/planets.model");
const { LoadLaunchData } = require("./models/launches.model");
const PORT = process.env.PORT || 8000;

// const options = {
//   key: fs.readFileSync('key.pem'),   
//   cert: fs.readFileSync('cert.pem'),
// };

const server = http.createServer(app);


async function startServer() {
  await mongoConnect();
  await loadPlanetsData();
  await LoadLaunchData();
  server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
  });
}

startServer();
