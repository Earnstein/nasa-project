const { Router } = require("express");
const { httpGetAllLaunches, httpAddNewLaunch, httpAbortLaunch, httpGetAllSongs, httpAddNewSong } = require("./launches.controller");

launchesRouter = Router();

launchesRouter.get("/", httpGetAllLaunches);
launchesRouter.get("/song", httpGetAllSongs)
launchesRouter.post("/", httpAddNewLaunch);
launchesRouter.post("/song", httpAddNewSong)
launchesRouter.delete("/:id", httpAbortLaunch);

module.exports = {
  launchesRouter,
};
