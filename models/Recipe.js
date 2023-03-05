const mongoose = require("mongoose")

const Schema = mongoose.Schema;

let recipeSchema = new Schema({
    name: String,
    question: String,
    comments: Array,
});

module.exports = mongoose.model("Recipe", recipeSchema);