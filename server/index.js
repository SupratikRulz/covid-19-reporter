require("dotenv").config();

const PORT = process.env.PORT || 8888;

const express = require("express");
const cors = require("cors");
const querystring = require("querystring");
const bodyParser = require("body-parser");
const nodefetch = require("node-fetch");
const path = require("path");
const cluster = require("cluster");
const numCPUs = require("os").cpus().length;

// Multi-process to utilize all CPU cores.
if (cluster.isMaster) {
  console.warn(`Node cluster master ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.error(
      `Node cluster worker ${worker.process.pid} exited: code ${code}, signal ${signal}`
    );
  });
} else {
  const app = express();

  // Priority serve any static files.
  app
    .use(express.static(path.resolve(__dirname, "../client/build")))
    .use(cors())
    .use(bodyParser.json());

  // Serve the react build files when hit on root
  app.get("/", (req, res) => {
    res.render(path.resolve(__dirname, "../client/build/index.html"));
  });

  app.post("/country", async (req, res) => {
    let country = req.body.country;

    const confirmcases = async country => {
      const query = querystring.stringify({
        f: "json",
        where:
          (country &&
            "(Confirmed > 0) AND (Country_Region='" + country + "')") ||
          "1=1",
        returnGeometry: false,
        spatialRel: "esriSpatialRelIntersects",
        outFields: "*",
        outStatistics: [
          {
            statisticType: "sum",
            onStatisticField: "Confirmed",
            outStatisticFieldName: "value"
          }
        ],
        outSR: 102100,
        cacheHint: true
      });

      let URL =
        "https://services1.arcgis.com/0MSEUqKaxRlEPj5g/arcgis/rest/services/ncov_cases/FeatureServer/1/query?" +
        query;

      const result = await nodefetch(URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        }
      });

      const output = await result.json();
      return output.features;
    };

    const cases = await confirmcases(country);

    res.send(cases);
  });

  // All remaining requests return the react-app, so it can handle the rest of browser routing.
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../client/build", "index.html"));
  });

  // Start the server and listen on specified PORT
  app.listen(PORT, () => {
    console.warn(
      `Node cluster worker ${process.pid}: listening on port ${PORT}`
    );
  });
}
