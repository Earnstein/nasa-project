const { Router } = require("express");
const { httpGetAllLaunches, httpAddNewLaunch, httpAbortLaunch} = require("./launches.controller");

launchesRouter = Router();

launchesRouter.get("/", httpGetAllLaunches);
launchesRouter.post("/", httpAddNewLaunch);
launchesRouter.delete("/:id", httpAbortLaunch);

module.exports = {
  launchesRouter,
};
