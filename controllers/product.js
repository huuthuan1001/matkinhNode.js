const Product = require("../schemas/products"); // import model

// Hàm tạo 1 sản phẩm mới
const CreateAProduct = async (
  name,
  price,
  quantity,
  description,
  urlImg,
  category,
  slug
) => {
  const newProduct = new Product({
    name,
    price,
    quantity,
    description,
    urlImg,
    category,
    slug,
  });
  return await newProduct.save();
};

const GetAllProducts = async () => {
  return await Product.find({ isDeleted: false }).populate("category");
};

module.exports = {
  CreateAProduct,
  GetAllProducts,
};
