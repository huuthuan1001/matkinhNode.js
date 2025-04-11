var express = require("express");
var router = express.Router();
let productModel = require("../schemas/products");

/* GET home page. */
router.get("/", async function (req, res, next) {
  try {
    let products = await productModel
      .find({ isDeleted: false })
      .populate("category", "name description");

    let html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Trang chủ - Mắt kính thời trang</title>
      </head>
      <body>
        <h1>Chào mừng đến với cửa hàng Mắt kính thời trang</h1>
        <div id="products">
    `;

    products.forEach((product) => {
      html += `
        <div class="product">
          <h2>${product.name}</h2>
          <p>${product.description}</p>
          <p>Giá: ${product.price} VNĐ</p>
          <p>Danh mục: ${product.category.name}</p>
        </div>
      `;
    });

    html += `
        </div>
      </body>
      </html>
    `;

    res.send(html); // Gửi HTML đã render ra cho client
  } catch (error) {
    next(error);
  }
});

module.exports = router;
