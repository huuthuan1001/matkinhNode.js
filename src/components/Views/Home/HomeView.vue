<template>
    <main class="site-main" id="home">
        <section class="hero-banner">
            <div class="container">
                <h1>Khám Phá Thế Giới Mắt Kính</h1>
                <p>Những mẫu mắt kính mới nhất với giá tốt nhất.</p>
                <a href="/controllers/search" class="cta-button">Xem Ngay</a>
            </div>
        </section>
        <section class="featured-products">
            <div class="container">
                <h2>Sản Phẩm Nổi Bật</h2>
                <div class="product-grid"  v-if="products.length > 0">
                    <article class="product-item" v-for="item in products" :key="item._id">
                        <img :src="item.urlImg" alt="Sản phẩm" class="product-image" />
                        <router-link :to="{ name: `product-detail`, params: { id: item._id } }">
                            {{ item.name }}
                        </router-link>
                        <p class="price">{{ formatPrice(item.price) }}</p>
                        <button :id="item._id" @click="AddOrder(item._id)">Thêm vào giỏi hàng</button>
                    </article>
                </div>

                <div v-else>
                    <p>Không có sản phẩm nào để hiển thị.</p>
                </div>
            </div>
        </section>
    </main>
</template>

<script>
import ProductVM from '@/models/Enities/ProductVM';
import ProductService from '@/services/ProductService';
import CartService from '../../../services/CartService';
export default {
    data() {
        return {
            products: [new ProductVM()],
        }
    },
    methods: {
        async AddOrder(id) {
            const res = await CartService.AddCart(id);
            const button = document.getElementById(id);
            button.innerText = "Đã thêm ✅";
            setTimeout(() => {
                button.classList.remove("accept");
                button.innerText = "Thêm vào giỏ hàng";
            }, 1500);
        },
        formatPrice(value) {
            const number = Number(value); // ép kiểu
            if (isNaN(number)) return '';
            if (number < 1000) {
                return `${number}đ`;
            }
            return new Intl.NumberFormat('vi-VN').format(number) + ' đ';
        },
        async GetAllProducts() {
            try {
                const res = await ProductService.GetAllProducts();
                // console.log("hehehehe   ",res);
                this.products = res.data;
                console.log(this.products);

            } catch (error) {
                console.error("Lỗi khi tải sản phẩm:", error);
            }
        },

    },
    async created() {
        await this.GetAllProducts();
    },
    name: 'Home',
}
</script>

<style>
.accept {
    background-color: #4caf50;
    color: white;
    transition: all 0.3s ease;
}
</style>