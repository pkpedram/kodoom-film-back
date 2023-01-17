const express = require("express");
const Director = require("../../db/Directors");
const multer = require("multer");
const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "media/");
    },
    filename: function (req, file, cb) {
      cb(
        null,
        file.originalname.split(".")[0] +
          "_director." +
          file.originalname.split(".")[1]
      );
    },
  }),
});

const directorRouter = express.Router();

directorRouter.post("/", upload.single("image"), async (req, res) => {
  try {
    console.log(req.file);
    let actor = new Director({
      fullName: req.body.fullName,
      image: req.file
        ? "media/" +
          req.file.originalname.split(".")[0] +
          "_actor." +
          req.file.originalname.split(".")[1]
        : null,
    });
    await actor.save();

    res.send(actor);
  } catch (error) {
    res.send(error);
    console.log(error);
  }
});

directorRouter.get("/", async (req, res) => {
  const searchKeyword = req.query.search
    ? {
        fullName: {
          $regex: req.query.search,
          $options: "i",
        },
      }
    : {};
  const data = await Director.find({ ...searchKeyword })
    .skip(
      req.query.pageIndex > 0
        ? (req.query.pageIndex - 1) * req.query.pageSize
        : 0
    )
    .limit(req.query.pageSize);
  let count = await Director.count();
  res.send({
    count: count,
    results: data,
  });
});
directorRouter.get("/:id", async (req, res) => {
  const data = await Director.findById(req.params.id);
  res.send(data);
});

directorRouter.patch(
  "/:id",

  async (req, res) => {
    const actorId = req.params.id;
    const actor = await Director.findById(actorId);
    if (actor) {
      let keys = Object.keys(req.body);
      keys.map((key) => (actor[key] = req.body[key]));
      const updatedActor = await actor.save();
      if (updatedActor) {
        res.send(updatedActor);
      } else {
        res.status(500).send({ message: "Error in updaing actor" });
      }
    } else {
      res.status(404).send({ message: "actor Not Found" });
    }
  }
);
directorRouter.delete(
  "/:id",

  async (req, res) => {
    const actor = await Director.findById(req.params.id);
    if (actor) {
      await product.remove();
      res.send({ message: "Director Deleted" });
    } else {
      res.status(404).send({ message: "Director Not Found" });
    }
  }
);

module.exports = directorRouter;
