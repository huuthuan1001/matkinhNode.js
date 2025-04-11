import ProductVM from "./ProductVM.js";
export default class OrderVM {
    constructor(data = {}) {
        this.productId = (data.productId || []).map(item => new ProductVM(item));
        this.name = data.name || "";     
        this.quantity = data.quantity || 0;    
        this.price = data.price || 1;     
    }
}
