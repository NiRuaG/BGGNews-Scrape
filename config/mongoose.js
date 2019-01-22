const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/bggnewsscraper";

mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

module.exports = mongoose;