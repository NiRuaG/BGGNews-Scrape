const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const NoteSchema = new Schema({
  body: String
});


module.exports = mongoose.model("Note", NoteSchema);
