require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const crypto = require("crypto");
const port = process.env.PORT || 3333;
const dns = require("dns");
const { connection } = require("mongoose");
const { FccModel } = require("./config/db");
const validUrlPattern =
  /^https?:\/\/[A-Za-z0-9\-_]+(\.[A-Za-z0-9\-_]+)+([/?].*)?$/;

// connection
// FccModel

app.use("/public", express.static(`${process.cwd()}/public`));
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

app.post("/api/shorturl", async (req, res) => {
  const { url } = req.body;

  if (!validUrlPattern.test(url)) {
    return res.json({ error: "Invalid URL" });
  }

  const hash = crypto.createHash("sha256");
  hash.update(url);
  const hashDigest = hash.digest("hex");
  const numericValue = parseInt(hashDigest, 16) % 10000;

  try {
    const findData = await FccModel.findOne({ longUrl: url });
    if (findData) {
      return res.json({
        original_url: findData.longUrl,
        short_url: findData.shortUrl,
      });
    }
    const data = new FccModel({ longUrl: url, shortUrl: numericValue });
    await data.save();
    res.json({ original_url: url, short_url: numericValue });
  } catch (error) {
    res.json({ err: error });
  }
});

app.get("/api/shorturl/:short_url", async (req, res) => {
  const short_url = req.params.short_url;
  // console.log(short_url);
  try {
    const data = await FccModel.findOne({ shortUrl: short_url });
    console.log(data);
    // console.log(data.longUrl);
    res.redirect(data.longUrl);
  } catch (error) {
    console.log(error);
    res.send({ msg: error });
  }
});

app.listen(8080, async function () {
  try {
    console.log(`Listening on port ${8080}`);
    await connection();
    console.log("Connected to DB");
  } catch (error) {}
});

// {"original_url":"https://url-shortener-microservice.freecodecamp.rocks","short_url":1052}
