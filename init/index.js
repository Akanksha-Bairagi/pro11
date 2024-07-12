const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js"); // Correct import

const MONGO_URL = "mongodb://127.0.0.1:27017/pink1";

async function main() {
    await mongoose.connect(MONGO_URL);
    await initDB();
    console.log("Connected to DB and initialized data");
}

const initDB = async () => {
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data);
    console.log("Data was initialized");
};

main().catch((err) => {
    console.error("Error connecting to DB:", err);
});