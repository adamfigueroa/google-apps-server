const express = require("express");
const morgan = require("morgan");

const playStore = require("./playstore");

const app = express();
const morganMiddlewareFunc = morgan("common");

app.use(morganMiddlewareFunc);

app.get("/apps", (req, res) => {
  let playList = [...playStore];
  let { genres, sort } = req.query;
  const possibleGenres = [
    "action",
    "puzzle",
    "strategy",
    "casual",
    "arcade",
    "card",
  ];
  let genresFilter = [];

  const capitalize = (s) => {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
  }

  if (genres !== undefined && !possibleGenres.includes(genres.toLowerCase())) {
    return res
      .status(400)
      .send("Genre must be: action, puzzle, strategy, casual, arcade, or card");
  }

  if (genres) {
    genresFilter = playList.filter((playApp) =>
      playApp.Genres.toLowerCase().includes(genres.toLowerCase())
    );
  }

  if (genres === undefined) {
      genresFilter = playList
  }

  if (sort !== undefined && sort.toLowerCase() !== "rating" && sort.toLowerCase() !== "app") {
    return res
    .status(400)
    .send('Sort must be either "Rating" or "App"');
  }

  if (sort) {
      sort = capitalize(sort);
      if (sort === 'Rating') {
        genresFilter.sort((currApp, nextApp) => {
            if (currApp[sort] < nextApp[sort]) {
                return 1;
            } else if (nextApp[sort] < currApp[sort]) {
                return -1;
            } else return 0;
          });
      } else {
        genresFilter.sort((currApp, nextApp) => {
            if (currApp[sort] < nextApp[sort]) {
                return -1;
            } else if (nextApp[sort] < currApp[sort]) {
                return 1;
            } else return 0;
          });
      }
  };

  res.json(genresFilter);
});

module.exports = app;
