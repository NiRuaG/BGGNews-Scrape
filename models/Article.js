const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const ArticleSchema = new Schema({

  //* `title` is article's headline
  title: {
    type: String,
    required: true,
    default: "",
    trim: true
  },

  //* `summary` is short paragraph 
  summary: {
    type: String,
    required: true,
    default: "",
    trim: true
  },

  //* `link` is URL to source 
  link: {
    type: String,
    required: true,
    default: "",
    trim: true
  },

  //* `postID` is unique number 
  postID: {
    type: Number,
    required: true,
    unique: true
  },

  //* `notes` is an array of Note (models)
  notes: [{
    type: Schema.Types.ObjectId,
    ref: "Note"
  }]

});


module.exports = mongoose.model("Article", ArticleSchema);
