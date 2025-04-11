class ProductDTO {
  constructor(data = {}) {
    this.name = data.name || "";
    this.price = data.price || 0;
    this.description = data.description || "";
    this.quantity = data.quantity || 0;
    this.category = data.category || "";
    this.urlImg = data.urlImg || "";
  }

  toJSON() {
    return {
      name: this.name,
      price: this.price,
      description: this.description,
      quantity: this.quantity,
      category: this.category,
      urlImg: this.urlImg,
    };
  }
}

export default ProductDTO;