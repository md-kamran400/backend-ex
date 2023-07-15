
const mongoose = require("mongoose")

const blackListSchema = new mongoose.Schema({
    blacklist: {type: [String]},
})

const BlackListmodel = mongoose.model("blacklist", blackListSchema)
module.exports = BlackListmodel