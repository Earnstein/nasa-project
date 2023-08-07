const {
  getAllLaunches,
  addNewLaunch,
  existLaunchWithId,
  abortLaunchById,
  addNewSong,
  getAllSongs
} = require("../../models/launches.model");

function httpGetAllLaunches(req, res) {
  return res.status(200).json(getAllLaunches());
}

function httpGetAllSongs(req, res){
  return res.status(200).json(getAllSongs())
}

function httpAddNewLaunch(req, res) {
  const launch = req.body; //json request

  if (
    !launch.mission ||
    !launch.rocket ||
    !launch.launchDate ||
    !launch.target
  ) {
    return res.status(400).json({
      error: "Missing required launch property",
    });
  }
  launch.launchDate = new Date(launch.launchDate);

  if (isNaN(launch.launchDate)) {
    return res.status(400).json({
      error: "Invalid Launch Date",
    });
  }
  addNewLaunch(launch);
  return res.status(201).json(launch);
}

function httpAddNewSong(req, res){
    const song = req.body; //json request
    if (!song.artist || !song.song) {
      return res.status(400).json({
        error: "Missing required song property",
      });
    };
    addNewSong(song);
    return res.status(201).json(song)
}

function httpAbortLaunch(req, res) {
  const launchId = Number(req.params.id);
  //if launch does not exist
  if (!existLaunchWithId(launchId)) {
    return res.status(404).json({
      error: "Launch not found",
    });
  }
  // if launch does exist
  const aborted = abortLaunchById(launchId)
  return res.status(200).json(aborted);
}
module.exports = {
  httpGetAllLaunches,
  httpAddNewLaunch,
  httpAbortLaunch,
  httpGetAllSongs,
  httpAddNewSong,
};
