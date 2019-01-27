const router = require('express').Router();

const { Article, Note } = require('./../models');


router.delete('/:_id', async (req, res) => {

  const { _id } = req.params;
  const { postID } = req.body;

  console.log(_id, req.body);

  try {
    const { ok } = await Note.deleteOne({ _id });

    if (ok) {
      await Article.findOneAndUpdate({ postID },
        { $pull: { notes: _id } } // update operation
      );

      return res.status(200).json({ ok });
    }
    else throw "Note deletion NOT 'ok'";
  }

  catch (error) {
    console.log(error);
    res.status(500).send("Internal Note deletion Error");
  }

}); // router.delete(.. => {..})


module.exports = router;