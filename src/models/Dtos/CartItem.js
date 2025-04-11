class CartItemDTO {
    constructor(data = {}) {
        this.productId = data.productId || "";
        this.quantity = data.quantity || null;
    }
    toJSON() {
        const json = {};
        if (this.productId !== null) json.productId = this.productId;
        if (this.quantity !== null) json.quantity = this.quantity;
        return json;
    }
  }
  
  export default CartItemDTO;