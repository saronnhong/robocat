import express from "express";
import cors from "cors";
import "core-js/stable";
import "regenerator-runtime/runtime";
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();

app.use(cors()).use(express.json());
app.get("/health", (req, res, next) => {
  res.send("OK!");
});

app.post("/findfriends", async (req, res, next) => {
  const website = req.body.website;
  try {
    const friends = await findFriends(website);
    res.send(friends);
  } catch (err) {
    console.error("oops", err)
    res.status(500).send({
      sorry: `I'm not very good at finding friends on '${website}'`,
      err: err.message,
      stack: err.stack
    });
  }
});

const port = 3000;
app.listen(port, () => {
  console.log(`server started ${port}`);
});

/** TODO return promise of friends json. */
function findFriends(website) {
  return axios.get(website).then(function (res) {
    var results = {};
    results.title = "";
    results.headers = [];
    const $ = cheerio.load(res.data);

    results.title = $("head").find("title").text().trim();

    $(":header").each(function (i, element) {
      var foundHeaders = $(this).text().toLowerCase().trim();
      if (foundHeaders.includes("cat") || foundHeaders.includes("kitten") || foundHeaders.includes("dog") || foundHeaders.includes("puppy")) {
        foundHeaders = foundHeaders[0].toUpperCase() + foundHeaders.slice(1);     
        results.headers.push(foundHeaders);
      };
    });

    return results;
  });









}
