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
    
    const $ = cheerio.load(res.data);

    $("head").each(function (i, element) {
      results.title = $(this).find("title").text().trim();
      console.log("Title: ", results.title);
    });

    $("h3").each(function (i, element) {
      results.headers=[];
      var foundHeaders = $(this).text().trim();
      if(foundHeaders.includes("kitten") || foundHeaders.includes("dog") || foundHeaders.includes("puppy")){
        results.headers.push(foundHeaders);
      }
    });
    
    console.log("Headers: ",results.headers);
    
    // if ((results.headers.length === 0)){
    //   throw new Error("I don't know how to find friends!");
    // }else{
    //   return results;
    // }
    return results;
  });
    

  
  
  

  
  

}
