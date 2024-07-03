const express = require("express");
const request = require("request");
const bodyParser = require("body-parser");
const app = express();

const cors = require("cors");

const myLimit = "100kb";

app.use(bodyParser.json({ limit: myLimit }));
app.use(cors());

app.get("/", async function (req, res, next) {
  // Set CORS headers: allow all origins, methods, and headers: you may want to lock this down in a production environment
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, PATCH, POST, DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    req.header("access-control-request-headers")
  );

  if (req.method === "OPTIONS") {
    // CORS Preflight
    res.send();
  } else {
    const targetURL = req.header("Target-URL");
    console.log(targetURL)
    if (!targetURL) {
      res
        .status(500)
        .send({ error: "There is no Target-Endpoint header in the request" });
      return;
    }
    request(
      {
        url: targetURL,
        method: req.method,
        json: req.body,
        headers: { "User-Agent": req.header("User-Agent") },
      },
      function (error, response, body) {
        if (error) {
          console.error("error: " + error);
        }
      }
    ).pipe(res);
  }
});

app.listen(8080, function () {
  console.log("Proxy server listening on port 8080");
});
