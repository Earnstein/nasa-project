const axios = require("axios");

const launchesDatabase = require("./launches.mongo");
const planets = require("./planets.mongo");

const DEFAULT_FLIGHT_NUMBER = 100;
const SPACEX_API_URL = "https://api.spacexdata.com/v4/launches/query";

params = {
  query : {},
  options: {
    pagination: false,
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

async function populateLaunches(){
  console.log("Downloading data");
  const response = await axios.post(SPACEX_API_URL, params);
  
  if (response.status !== 200) {
    console.log("probelm downloading data");
    throw new Error("Launch data download failed")
  };

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
      launchDate: launchDoc['date_local'],
      upcoming: launchDoc['upcoming'],
      success: launchDoc['success'],
      customers,
    }
  console.log (`${launch.flightNumber} [${launch.customers}]`);
  await saveLaunch(launch)
  };
}

async function LoadLaunchData() {
  const firstLaunch = await findLanuch({
    flightNumber: 1,
    rocket: "Falcon 1",
    mission: "FalconSat",
  });
  if (firstLaunch){
    console.log("Launch data already exists");
  }
  else{
   await populateLaunches()
  }
}

async function findLanuch(filter){
  return await launchesDatabase.findOne(filter)
}

async function existLaunchWithId(launchId) {
  return await findLanuch({
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

async function getAllLaunches(skip, limit) {
  return await launchesDatabase
  .find({},{_id: 0,__v: 0,})
  .sort({flightNumber: 1})
  .skip(skip)
  .limit(limit);
}

async function saveLaunch(launch) {
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
  const planet = await planets.findOne({
    keplerName: launch.target,
  });

  if (!planet) {
    throw new Error("No matching planet found");
  }
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
