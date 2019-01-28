const router = require('express').Router();

const { Article, Note } = require('./../models');
const { connection: db } = require('./../config/mongoose');

router.delete('/', async (req, res) => {
  try {
    await db.dropDatabase();
    return res.status(200).json({});
  }

  catch (error) {
    console.log(error);
    res.status(500).send("Internal Articles deletion Error");
  }

});


router.post('/:id', async (req, res) => {

  try {
    const dbNote = await Note.create(req.body);

    await Article.findOneAndUpdate({ postID: req.params.id },
      { $push: { notes: dbNote._id }},
      { new: true }
    );

    return res.status(200).json(dbNote.body);
  }

  catch (error) {
    console.log(error);
    res.status(500).send("Internal Note saving Error");
  }

});


module.exports = router;