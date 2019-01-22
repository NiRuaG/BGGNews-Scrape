const express = require('express');
const app = express();

const db = require('./config/mongoose');


// Middleware
app.use(require('morgan')('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// Handlebars = View Engine
app.engine('handlebars',
  require('express-handlebars')({ defaultLayout: 'main' }));
app.set("view engine", 'handlebars');



app.get('/', (req, res) => {
  res.render('index');
});



{
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`App listening on http://localhost:${PORT}`);
  });
}
