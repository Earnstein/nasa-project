const { parse } = require("csv-parse");
const fs = require("fs");
const path = require("path");
const planets = require("./planets.mongo");

const isHabitablePlanet = (planet) => {
  return (
    planet["koi_disposition"] === "CONFIRMED" &&
    planet["koi_insol"] > 0.36 &&
    planet["koi_insol"] < 1.11 &&
    planet["koi_prad"] < 1.6
  );
};

async function loadPlanetsData() {
  const csvFilePath = path.join(__dirname, "..", "..", "data", "kleper_data.csv");

  try {
    const readableStream = fs.createReadStream(csvFilePath);

    const parser = parse({
      comment: "#",
      columns: true,
    });

    readableStream.pipe(parser);

    for await (const data of parser) {
      if (isHabitablePlanet(data)) {
        await savePlanet(data);
      }
    }

    const countPlanetsFound = (await getAllPlanets()).length;
    console.log(`${countPlanetsFound} habitable planets were found`);
  } catch (err) {
    console.log(err);
    throw err;
  }
}

async function getAllPlanets() {
  return await planets.find({}, {
    '__v': 0,
    '_id': 0,
  });
}

async function savePlanet(planet) {
  try {
    await planets.updateOne(
      {
        keplerName: planet.kepler_name,
      },
      {
        keplerName: planet.kepler_name,
      },
      {
        upsert: true,
      }
    );
  } catch (err) {
    console.error(`Could not save planet ${err}`);
  }
}

module.exports = {
  loadPlanetsData,
  getAllPlanets,
};
