const express = require("express");
const Actor = require("../../db/Actors");
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
          "_actor." +
          file.originalname.split(".")[1]
      );
    },
  }),
});

const actorRouter = express.Router();

actorRouter.post("/", upload.single("image"), async (req, res) => {
  try {
    console.log(req.file);
    let actor = new Actor({
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

actorRouter.get("/", async (req, res) => {
  const searchKeyword = req.query.search
    ? {
        fullName: {
          $regex: req.query.search,
          $options: "i",
        },
      }
    : {};
  const data = await Actor.find({ ...searchKeyword })
    .skip(
      req.query.pageIndex > 0
        ? (req.query.pageIndex - 1) * req.query.pageSize
        : 0
    )
    .limit(req.query.pageSize);
  let count = await Actor.count();
  res.send({
    count: count,
    results: data,
  });
});
actorRouter.get("/:id", async (req, res) => {
  const data = await Actor.findById(req.params.id);
  res.send(data);
});

actorRouter.patch(
  "/:id",

  async (req, res) => {
    const actorId = req.params.id;
    const actor = await Actor.findById(actorId);
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
actorRouter.delete(
  "/:id",

  async (req, res) => {
    const actor = await Actor.findById(req.params.id);
    if (actor) {
      await product.remove();
      res.send({ message: "Actor Deleted" });
    } else {
      res.status(404).send({ message: "Actor Not Found" });
    }
  }
);

module.exports = actorRouter;
