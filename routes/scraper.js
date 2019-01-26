const router  = require('express').Router();
const axios   = require('axios');
const cheerio = require('cheerio');

const { Article } = require('./../models');


router.get('/', (_, res) => {

  axios.get('https://boardgamegeek.com/blog/1/')

    .then(checkResponseData)
    .then(parseHTMLData)
    .then(saveToDB)
    .then(async (dbPromise) => {
      res.json(await dbPromise);
    })

    .catch(error => {
      console.error("Scrape Error:\n\t", error, "\n\n");
      if (error !== null) { logAxiosError(error); }
      res.status(500).send("Internal Scraping Error");
    }); // axios.get(..)

});

module.exports = router;



const checkResponseData = ({ data } = {}) => {
  if (data) return data;

  throw { message: "response had no data!?", data };
}


const parseHTMLData = (data) => {

  const $ = cheerio.load(data);

  // // Now, we grab every h2 within an article tag, and do the following:
  const results = $("#blog_posts .blog_post").map( (_, element) => {

    const $el = $(element);
    
    //* Title datum
    const title = $el.find(".post_header .post_title").text().trim();

    //* postID & link datum
    let postID, link; { 
      const relLink = $el.find(".post_header .post_title a").attr("href");
      
      postID = relLink.match(/^\/blogpost\/(.*)\//)[1];
      link = `https://boardgamegeek.com${relLink}`;
    }

    /* //* Date datum
    // <div class="post_date">
		// 	<span class="post_day">23</span>
		// 	<span class="post_month">Jan</span>
		// 	<span class="post_year">2019</span>
    // </div> */

    //* Summary datum
    let summary; { 
      //% cheerio's text() function does not preserve <br> tags as line breaks (removes them completely instead)
      $el.find('br').replaceWith('\n');
      summary = $el.find(".post_body .right").text().trim();
      
      summary = summary.substring(0, summary.indexOf('\n')); // take the first "paragraph"
    }


    return {
      title,
      summary,
      link,
      postID
    };

  }); // results = $(..).map(..

  return results.get();

}


const saveToDB = (articles) =>
  Promise.all(
    articles.map( (article) => 
      Article.findOneAndUpdate({ postID: article.postID },
        article,
        { 
          new: true,
          upsert: true,
          runValidators: true,
          setDefaultsOnInsert: true
        })))



const logAxiosError = ({ response, request, message, config } = {}) => {

  if (response) {
    // The request was made and the server responded with a status code that falls out of the range of 2xx
    console.error("data   :\n\t", response.data   );
    console.error("status :\n\t", response.status );
    console.error("headers:\n\t", response.headers);
  }

  // The request was made but no response was received `error.request` is an instance of http.ClientRequest
  request && console.error("request:\n\t", request);

  // Something happened in setting up the request that triggered an Error
  message && console.error("message:\n\t", message);

  config && console.log("config:\n\t", config);

}