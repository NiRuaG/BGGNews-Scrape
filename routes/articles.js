const router = require('express').Router();

const { Article, Note } = require('./../models');

// router.get('/', (req, res) => {
//   Article.find({})
// });

router.route('/:id')

  //* GET
  .get((req, res) => {

  })

  //* POST
  .post( async (req, res) => {

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

  })

; // router.route(..)

module.exports = router;