var express = require("express");
var router = express.Router();
var menuSchema = require("../schemas/menu");
let slug = require("slugify");

/* GET home page. */
router.get("/", async function (req, res, next) {
  let all = await menuSchema.find({});
  let parents = [];
  for (const menu of all) {
    if (!menu.parent) {
      let children = [];
      for (const menuchild of all) {
        let childrenQ = await menuSchema.find({
          parent: menu._id,
        });
        children = childrenQ.map((c) => ({
          text: c.text,
          URL: c.URL,
        }));
      }
      parents.push({
        text: menu.text,
        URL: menu.URL,
        children: children,
      });
    }
  }
  res.send(parents);
});
router.post("/", async function (req, res, next) {
  let itemMenu = {
    text: req.body.text,
    URL: `/${slug(req.body.text, { lower: true })}`,
  };
  if (req.body.parent) {
    let parentItem = await menuSchema.findOne({
      text: req.body.parent,
    });
    itemMenu.parent = parentItem._id;
  }
  let newMenu = new menuSchema(itemMenu);
  await newMenu.save();
  res.send(newMenu);
});

router.delete("/:id", async function (req, res) {
  try {
    const deleted = await menuSchema.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true },
      { new: true }
    );
    res.send(deleted);
  } catch (err) {
    res.status(500).send({ message: "Xóa thất bại", error: err.message });
  }
});

router.put("/:id", async function (req, res) {
  try {
    let updateData = {
      text: req.body.text,
      URL: `/${slug(req.body.text, { lower: true })}`,
    };

    if (req.body.parent) {
      let parentItem = await menuSchema.findOne({ text: req.body.parent });
      updateData.parent = parentItem?._id;
    } else {
      updateData.parent = null; // nếu không truyền thì xóa parent
    }

    const updated = await menuSchema.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    res.send(updated);
  } catch (err) {
    res.status(500).send({ message: "Cập nhật thất bại", error: err.message });
  }
});

module.exports = router;
