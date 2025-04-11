// OrderItemDTO (Optional, but good practice for structure)
class OrderItemDTO {
    constructor(itemData = {}) {
        // Lấy từ item trong mảng Order.items
        this.productId = itemData.productId || null;
        this.name = itemData.name || '';
        this.quantity = itemData.quantity || 0;
        this.price = itemData.price || 0;
    }
}

class OrderDTO {
    constructor(data = {}) {
        // data ở đây thường là một Mongoose document từ Order.findOne() hoặc savedOrder
        this.id = data._id || data.id || null; // Lấy _id từ Mongoose
        this.userId = data.userId || null;

        this.items = Array.isArray(data.items)
            ? data.items.map(item => new OrderItemDTO(item))
            : [];

        this.totalAmount = data.totalAmount || 0;
        this.shippingAddress = data.shippingAddress || "";

        this.paymentMethod = data.paymentMethod || 'N/A';
    }
    toJSON() {
        return {
            id: this.id,
            userId: this.userId,
            items: this.items,
            totalAmount: this.totalAmount,
            shippingAddress: this.shippingAddress,
            paymentMethod: this.paymentMethod,
        };
    }
}

export default OrderDTO;