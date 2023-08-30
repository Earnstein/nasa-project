const axios = require("axios");

const launchesDatabase = require("./launches.mongo");
const planets = require("./planets.mongo");

const SPACEX_API_URL = "https://api.spacexdata.com/v4/launches/query";

params = {
  query : {},
  options: {
      populate: [
          {
          path: 'rocket',
          select: {
              'name': 1
          }
      },
          {
          path: "payloads",
          select: {
              customers: 1
          }
      }
      ]
  }
}


const DEFAULT_FLIGHT_NUMBER = 100;

const launches = new Map();

const launch = {
  flightNumber: 100, // exist in space x api as (flight_number)
  mission: "Kepler Exploration", //name
  rocket: "Explorer IS1", //exist in space x api as (rocket.name)
  launchDate: new Date("December 27, 2030"), //(data_local)
  target: "Kepler-442 b", // not applicable
  customers: ["ZTM", "NASA"],
  upcoming: true, // (upcoming)
  success: true, // (success)
};

saveLaunch(launch);

async function LoadLaunchData() {
  const response = await axios.post(SPACEX_API_URL, params)
  const launchDocs = response.data.docs;

  for (const launchDoc of launchDocs) {
    const payloads = launchDoc['payloads']
    const customers = payloads.flatMap( (payload)=>{
      return payload['customers']
    }, )
    const launch = {
      flightNumber: launchDoc['flight_number'],
      mission: launchDoc['name'],
      rocket: launchDoc['rocket']['name'],
      launchDate: launchDoc['data_local'],
      upcoming: launchDoc['upcoming'],
      success: launchDoc['success'],
      customers,
      
    }
  };

  console.log (`${launch.flightNumber} ${launch.customers}`);
}

async function existLaunchWithId(launchId) {
  return await launchesDatabase.findOne({
    flightNumber: launchId,
  });
}

async function getLatestFlightNumber() {
  const lastestLaunch = await launchesDatabase
    .findOne({})
    .sort("-flightNumber");

  if (!lastestLaunch) {
    return DEFAULT_FLIGHT_NUMBER;
  }
  return lastestLaunch.flightNumber;
}

async function getAllLaunches() {
  return await launchesDatabase.find(
    {},
    {
      _id: 0,
      __v: 0,
    }
  );
}

async function saveLaunch(launch) {
  const planet = await planets.findOne({
    keplerName: launch.target,
  });

  if (!planet) {
    throw new Error("No matching planet found");
  }

  await launchesDatabase.findOneAndUpdate(
    {
      flightNumber: launch.flightNumber,
    },
    launch,
    {
      upsert: true,
    }
  );
}

async function scheduleNewLaunch(launch) {
  const newFlightNumber = (await getLatestFlightNumber()) + 1;
  const newLaunch = Object.assign(launch, {
    customers: ["Zero to Mastery", "NASA"],
    flightNumber: newFlightNumber,
    upcoming: true,
    success: true,
  });

  await saveLaunch(newLaunch);
}

async function abortLaunchById(launchId) {
  const aborted = await launchesDatabase.updateOne(
    {
      flightNumber: launchId,
    },
    { upcoming: false, success: false }
  );

  return aborted.matchedCount === 1;
}

module.exports = {
  existLaunchWithId,
  getAllLaunches,
  scheduleNewLaunch,
  abortLaunchById,
  LoadLaunchData
};
