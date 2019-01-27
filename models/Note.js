const mongoose = require("mongoose");

const Schema = mongoose.Schema;


const NoteSchema = new Schema({
  body: {
    type: String,
    required: true,
    default: "",
    trim: true
  },
});


module.exports = mongoose.model("Note", NoteSchema);
