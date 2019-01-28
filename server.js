const express = require('express');
const app = express();


const db = require('./config/mongoose');
const { Article } = require('./models');


//* Middleware
app.use(
  require('morgan')('dev'),
  express.static("public"),
  express.urlencoded({ extended: true }),
  express.json()
);


{ //* Handlebars = View Engine
  app.engine('handlebars',
    require('express-handlebars')({ defaultLayout: 'main' }));
  app.set("view engine", 'handlebars');
}


{ //* Routes
  app.use('/scrape'  , require('./routes/scraper' ));
  app.use('/articles', require('./routes/articles'));
  app.use('/notes'   , require('./routes/notes'   ));

  app.get('/', async (req, res) => {

    try {
      const articles = await Article.find({}).populate('notes');

      res.render('index', { articles });
    }

    catch (error) {
      return res.status(500).json(error);
    }

  }); // app.get(=>{})
}


{ //* Start & Listen
  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(`App listening on http://localhost:${PORT}`);
  });
}