import CartItemVM from "./CartItemVM.js";
export default class CartVM{
    constructor(data = {}) {        
        this.id = data.id ||  null;
        this.user = data.user || "";
        this.items = (data.items || []).map(item => new CartItemVM(item));
    }
}
