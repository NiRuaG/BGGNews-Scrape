const express = require('express');
const app = express();


const db = require('./config/mongoose');
const { Article } = require('./models');


{ //* Middleware
  app.use(require('morgan')('dev'));
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
}


{ //* Handlebars = View Engine
  app.engine('handlebars',
    require('express-handlebars')({ defaultLayout: 'main' }));
  app.set("view engine", 'handlebars');
}


{ //* Routes
  app.use('/scrape', require('./routes/scraper'));
  app.use('/articles', require('./routes/articles'));
  
  app.get('/', async (req, res) => {

    let articles;
    try {
      articles = Article.find({});
    }
    catch (error) {
      return res.json(error);
    }

    console.log((await articles).length);
    res.render('index',
      {
        articles: await articles
      });

  });
}


{ //* Star & Listen
  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(`App listening on http://localhost:${PORT}`);
  });
}