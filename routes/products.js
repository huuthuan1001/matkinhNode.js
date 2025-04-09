var express = require("express");
var router = express.Router();
let productModel = require("../schemas/products");
let categoryModel = require("../schemas/category");
let { CreateErrorRes, CreateSuccessRes } = require("../utils/responseHandler");
let slug = require("slugify");

// Lấy tất cả sản phẩm
router.get("/", async function (req, res, next) {
  try {
    let products = await productModel
      .find({ isDeleted: false })
      .populate("category", "name description"); // Populating category

    CreateSuccessRes(res, products, 200);
  } catch (error) {
    next(error);
  }
});

// Lấy sản phẩm theo ID
router.get("/:id", async function (req, res, next) {
  try {
    let product = await productModel
      .findOne({
        _id: req.params.id,
        isDeleted: false,
      })
      .populate("category", "name description"); // Populating category

    CreateSuccessRes(res, product, 200);
  } catch (error) {
    next(error);
  }
});

// Thêm mới sản phẩm
router.post("/", async function (req, res, next) {
  try {
    let body = req.body;
    let category = await categoryModel.findOne({
      name: body.category,
    });

    if (category) {
      let newProduct = new productModel({
        name: body.name,
        price: body.price,
        quantity: body.quantity,
        category: category._id,
        slug: slug(body.name, { lower: true }),
        description: body.description,
        urlImg: body.urlImg,
      });
      await newProduct.save();
      CreateSuccessRes(res, newProduct, 200);
    } else {
      throw new Error("Category không tồn tại");
    }
  } catch (error) {
    next(error);
  }
});

// Cập nhật sản phẩm theo ID
router.put("/:id", async function (req, res, next) {
  let id = req.params.id;
  try {
    let body = req.body;
    let updatedInfo = {};

    if (body.name) {
      updatedInfo.name = body.name;
    }
    if (body.price) {
      updatedInfo.price = body.price;
    }
    if (body.quantity) {
      updatedInfo.quantity = body.quantity;
    }
    if (body.category) {
      updatedInfo.category = body.category;
    }

    let updatedProduct = await productModel
      .findByIdAndUpdate(id, updatedInfo, { new: true })
      .populate("category", "name description"); // Populating category

    CreateSuccessRes(res, updatedProduct, 200);
  } catch (error) {
    next(error);
  }
});

// Xóa sản phẩm
router.delete("/:id", async function (req, res, next) {
  let id = req.params.id;
  try {
    let updatedProduct = await productModel.findByIdAndUpdate(
      id,
      {
        isDeleted: true,
      },
      { new: true }
    );

    CreateSuccessRes(res, updatedProduct, 200);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
