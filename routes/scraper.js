const router = require('express').Router();
const axios = require('axios');
const cheerio = require('cheerio');


router.get('/', (req, res) => {

  axios.get("http://www.echojs.com/")

    .then(handleResponseData)
    .then((data) => res.json(data))

    .catch(error => {
      console.error("Axios Error:\n\t", error, "\n\n");
      logError(error);
      res.status(500).send("Internal Scraping Error");
    })

  ; // axios.get("http://www.echojs.com/")

}); 

module.exports = router;


const handleResponseData = ({ data }={}) => {
  if (data)
    return data;

  throw { message: "response had no data!?", data };

   /* // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);

    // Now, we grab every h2 within an article tag, and do the following:
    $("article h2").each(function(i, element) {
      // Save an empty result object
      var result = {};

      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(this)
        .children("a")
        .text();
      result.link = $(this)
        .children("a")
        .attr("href");

      // Create a new Article using the `result` object built from scraping
      db.Article.create(result)
        .then(function(dbArticle) {
          // View the added result in the console
          console.log(dbArticle);
        })
        .catch(function(err) {
          // If an error occurred, log it
          console.log(err);
        });
    });

    // Send a message to the client
    res.send("Scrape Complete"); */
}

const logError = (error) => {

  const { response, request, message, config } = error;

  if (response) {
    // The request was made and the server responded with a status code that falls out of the range of 2xx
    console.error("data:\n\t", response.data);
    console.error("status:\n\t", response.status);
    console.error("headersa:\n\t", response.headers);

  } else if (request) {
    // The request was made but no response was received `error.request` is an instance of http.ClientRequest
    console.error("request:\n\t", request);

  } else {
    // Something happened in setting up the request that triggered an Error
    console.error("message:\n\t", message);
  }

  console.log("config:\n\t", config);

}
