class CartDTO {
    constructor(data = {}) {
        this.user = data.user || "";
        this.items = data.items || null;
    }
    toJSON() {
        const json = {};
        if (this.user !== null) json.user = this.user;
        if (this.items !== null) json.items = this.items;
        return json;
    }
  }
  
  export default CartDTO;