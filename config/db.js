const mongoose = require('mongoose');

const MONGO_URL = mongoose.connect(process.env.MONGO_URL)
