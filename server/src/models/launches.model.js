// const launches = require("./launches.mongo");

const launches = new Map();
const songs = new Map
let latestFlightNumber = 100;
let songId = 10;
const launch = {
  flightNumber: 100,
  mission: "Kepler Exploration",
  rocket: "Explorer IS1",
  launchDate: new Date("December 27, 2030"),
  target: "Kepler-142 b",
  customers: ["ZTM", "NASA"],
  upcoming: true,
  success: true,
};
const song = {
  id: 10,
  artist : "Mj",
  song: "oh na na",
  playlist: false,
}

songs.set(song.id, song);

launches.set(launch.flightNumber, launch);

function existLaunchWithId(launchId){
  return launches.has(launchId);
}

function getAllLaunches() {
  return Array.from(launches.values());
}

function getAllSongs(){
  return Array.from(songs.values());  
}
function addNewLaunch(launch) {
  latestFlightNumber++; 
  launches.set(
    latestFlightNumber,
    Object.assign(launch, {
      customers: ['Zero to Mastery', 'NASA'],
      flightNumber: latestFlightNumber,
      upcoming:true,
      success:true,
    })
  );
}

function abortLaunchById(launchId){
  const aborted = launches.get(launchId);
  aborted.upcoming = false;
  aborted.success = false;
  return aborted;
}

function addNewSong(song){
    songId++;
    songs.set(songId, Object.assign(song, {
      id: songId,
      playlist: false
    }))
}
module.exports = {
  existLaunchWithId,
  getAllLaunches,
  addNewLaunch,
  abortLaunchById,
  addNewSong,
  getAllSongs,
};
