import CategoryVM from "./CategoryVM";
export default class ProductVM {
  constructor(data = {}) {
    this.id = data.productId || data.id || null;
    this.name = data.name || "";
    this.price = data.price || 0;
    this.quantity = data.quantity || 0;
    this.description = data.description || "";
    this.urlImg = data.urlImg || "";
    this.category = (data.category || []).map(item => new CategoryVM(item));
}
}
