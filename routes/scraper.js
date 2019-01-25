const router  = require('express').Router();
const axios   = require('axios');
const cheerio = require('cheerio');


router.get('/', (req, res) => {

  axios.get('https://boardgamegeek.com/blog/1/')

    .then(checkResponseData)
    .then(parseHTMLData)
    .then(json => res.json(json))

    .catch(error => {
      console.error("Scrape Error:\n\t", error, "\n\n");
      logError(error);
      res.status(500).send("Internal Scraping Error");
    })

    ; // axios.get(..)

});

module.exports = router;



const checkResponseData = ({ data } = {}) => {
  if (data)
    return data;

  throw { message: "response had no data!?", data };
}


const parseHTMLData = data => {
  const $ = cheerio.load(data);

  // // Now, we grab every h2 within an article tag, and do the following:
  const results = $("#blog_posts .blog_post").map((_index, element) => {
    const $el = $(element);
    
    //* Title datum
    const title = $el.find(".post_header .post_title").text().trim();

    let url; { //* URL datum
      url = $el.find(".post_header .post_title a").attr("href");
      url = `https://boardgamegeek.com${url}`;
    }
    
    //* Date datum
    // <div class="post_date">
		// 	<span class="post_day">23</span>
		// 	<span class="post_month">Jan</span>
		// 	<span class="post_year">2019</span>
    // </div>

    let summary; { //* Summary datum
      //% cheerio's text() function does not preseve <br> tags as line breaks (removes them completely instead)
      $el.find('br').replaceWith('\n');
      summary = $el.find(".post_body .right").text().trim();
      
      summary = summary.substring(0, summary.indexOf('\n'));
    }


    // if (_index===1)
    {
      console.log("title:\n", title);
      console.log("summary:\n", summary);
      console.log("url:\n", url);
    }

    return {
      title,
      summary,
      url
    }
    /*  // Save an empty result object
     var result = {};

     // Add the text and href of every link, and save them as properties of the result object
     result.title = $(this)
       .children("a")
       .text();
     result.link = $(this)
       .children("a")
       .attr("href"); */

    // Create a new Article using the `result` object built from scraping
    /* db.Article.create(result)
      .then(function(dbArticle) {
        // View the added result in the console
        console.log(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, log it
        console.log(err);
      }); */

  });

  console.log(typeof results.get(), Array.isArray(results.get()) && "is Array", results.get().length);

  return data;
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
