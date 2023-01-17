const express = require("express");
const multer = require("multer");
const Movie = require("../../db/Movies");
const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "media/");
    },
    filename: function (req, file, cb) {
      cb(
        null,
        file.originalname.split(".")[0] +
          "_movie." +
          file.originalname.split(".")[1]
      );
    },
  }),
});

const movieRouter = express.Router();

movieRouter.post("/", upload.single("mainPoster"), async (req, res) => {
  try {
    console.log(req.file);
    let movie = new Movie({
      title: req.body.title,
      translatedTitle: req.body.title,
      summary: req.body.summary,
      country: req.body.country,
      imdb: req.body.imdb,
      duration: req.body.duration,
      genres: req.body.genres,
      actors: req.body.actors,
      directors: req.body.directors,
      mainPoster: req.file
        ? "media/" +
          req.file.originalname.split(".")[0] +
          "_movie." +
          req.file.originalname.split(".")[1]
        : null,
    });
    await movie.save();

    res.send(movie);
  } catch (error) {
    res.send(error);
    console.log(error);
  }
});

movieRouter.get("/", async (req, res) => {
  const searchKeyword = req.query.search
    ? {
        title: {
          $regex: req.query.search,
          $options: "i",
        },
        translatedTitle: {
            $regex: req.query.search,
            $options: "i",
          },
        imdb: {
            
                $regex: req.query.imdb,
                $options: "i",
              },

        
      }
    : {};
  const data = await Movie.find({ ...searchKeyword })
    .skip(
      req.query.pageIndex > 0
        ? (req.query.pageIndex - 1) * req.query.pageSize
        : 0
    )
    .limit(req.query.pageSize);
  let count = await Movie.count({...searchKeyword});
  res.send({
    count: count,
    results: data,
  });
});
movieRouter.get("/:id", async (req, res) => {
  const data = await Movie.findById(req.params.id);
  res.send(data);
});

movieRouter.patch(
  "/:id",
  upload.single("mainPoster"),
  async (req, res) => {
    const movieId = req.params.id;
    const movie = await Movie.findById(movieId);
    if (movie) {
      let keys = Object.keys(req.body);
      console.log(req.body)
      keys.map((key) => (movie[key] = req.body[key]));
      const udatedMovie = await movie.save();
      if (udatedMovie) {
        res.send(udatedMovie);
      } else {
        res.status(500).send({ message: "Error in updaing movie" });
      }
    } else {
      res.status(404).send({ message: "movie Not Found" });
    }
  }
);
movieRouter.delete(
  "/:id",

  async (req, res) => {
    const movie = await Movie.findById(req.params.id);
    if (movie) {
      await movie.remove();
      res.send({ message: "Movie Deleted" });
    } else {
      res.status(404).send({ message: "Movie Not Found" });
    }
  }
);

module.exports = movieRouter;
