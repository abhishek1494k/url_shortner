const mongoose = require("mongoose");

const connection = mongoose.connect(
  "mongodb+srv://nestjs:nestjs@nestjs.r9vfyha.mongodb.net/fcc?retryWrites=true&w=majority"
);

const fccSchema = mongoose.Schema({
  longUrl: String,
  shortUrl: String,
});

const FccModel = mongoose.model("fcc", fccSchema);
module.exports = { connection, FccModel };
