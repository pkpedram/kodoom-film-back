const express = require("express");
const Genre = require("../../db/Geners");


const genreRouter = express.Router();

genreRouter.post("/", async (req, res) => {
  try { 
    let genre = new Genre({
        title: req.body.title
    });
    await genre.save();

    res.send(genre);
  } catch (error) {
    res.send(error);
    console.log(error);
  }
});

genreRouter.get("/", async (req, res) => {
  const searchKeyword = req.query.search
    ? {
        title: {
          $regex: req.query.search,
          $options: "i",
        },
      }
    : {};
  const data = await Genre.find({ ...searchKeyword })
    .skip(
      req.query.pageIndex > 0
        ? (req.query.pageIndex - 1) * req.query.pageSize
        : 0
    )
    .limit(req.query.pageSize);
  let count = await Genre.count({...searchKeyword});
  res.send({
    count: count,
    results: data,
  });
});
genreRouter.get("/:id", async (req, res) => {
  const data = await Genre.findById(req.params.id);
  res.send(data);
});

genreRouter.patch(
  "/:id",
  async (req, res) => {
    const genreId = req.params.id;
    const genre = await Genre.findById(genreId);
    if (genre) {
      let keys = Object.keys(req.body);
      console.log(req.body)
      keys.map((key) => (genre[key] = req.body[key]));
      const updatedGenre = await genre.save();
      if (updatedGenre) {
        res.send(updatedGenre);
      } else {
        res.status(500).send({ message: "Error in updaing Genre" });
      }
    } else {
      res.status(404).send({ message: "Genre Not Found" });
    }
  }
);
genreRouter.delete(
  "/:id",

  async (req, res) => {
    const genre = await Genre.findById(req.params.id);
    if (genre) {
      await genre.remove();
      res.send({ message: "Genre Deleted" });
    } else {
      res.status(404).send({ message: "Genre Not Found" });
    }
  }
);

module.exports = genreRouter;
