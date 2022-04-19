const { mongoose } = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

function connectDb() {
  const MONGO_URL = process.env.MONGO_URL;
  mongoose.connect(MONGO_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });
  mongoose.connection.once("open", () => {
    console.log("connected to database");
  });
}

module.exports = connectDb;
