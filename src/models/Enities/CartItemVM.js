import ProductVM from "./ProductVM.js";
export default class CartItemVM{
    constructor(data = {}) {        
        this.id = data.id ||  null;
        this.product = (data.product || []).map(item => new ProductVM(item));
        this.quantity = data.quantity || null;}
}
