<template>
    <div class="product-form-container">
        <h2>{{ isEditMode ? 'Cập nhật Sản phẩm' : 'Thêm Sản phẩm mới' }}</h2>
        <form @submit.prevent="handleSubmit" class="product-form">
            <div v-if="error" class="error-message">{{ error }}</div>
            <div v-if="success" class="success-message">{{ success }}</div>

            <div class="form-group">
                <label for="productName">Tên sản phẩm:</label>
                <input type="text" id="productName" v-model="product.name" required placeholder="VD: Mắt kính dior" />
            </div>
            <div class="form-group">
                <label for="category">Loại mắt kính:</label>
                <select id="category" v-model="product.category" required>
                    <option :value="null" disabled>-- Chọn loại mắt kính --</option>
                    <option v-for="item in categories" :key="item._id" :value="item._id">
                        {{ item.name }}
                    </option>
                </select>
                <div v-if="brandLoading" class="loading-text">Đang tải danh sách thương hiệu...</div>
                <div v-if="brandError" class="error-text">{{ brandError }}</div>
            </div>
            <div class="form-group">
                <label for="productPrice">Giá (VNĐ):</label>
                <input type="number" id="productPrice" v-model.number="product.price" required min="0" />
            </div>

            <div class="form-group">
                <label for="productQuantity">Số lượng:</label>
                <input type="number" id="productQuantity" v-model.number="product.quantity" required min="0" />
            </div>

            <!-- <div class="form-group">
          <label for="productCategory">Danh mục:</label>
          <input type="text" id="productCategory" v-model="product.category" required placeholder="VD: Laptop" />
        </div> -->

            <div class="form-group">
                <label for="description">Mô tả:</label>
                <textarea id="description" v-model="product.description" rows="4"></textarea>
            </div>

            <div class="form-group">
                <label for="productImage">Đường dẫn hình ảnh:</label>
                <input v-model="product.urlImg" type="text" id="productImage" />
            </div>

            <div class="form-actions">
                <button type="submit" class="btn-submit">
                    {{ isLoading ? 'Đang xử lý...' : (isEditMode ? 'Cập nhật' : 'Thêm mới') }}
                </button>
                <router-link :to="{ name: 'admin-product-list' }" class="btn-cancel">Hủy bỏ</router-link>
            </div>
        </form>

        <div v-if="isOk === 1" class="success-toast">Tạo mới thành công!</div>
        <div v-if="isOk === 2" class="success-toast">Cập nhật thành công!</div>
    </div>
</template>

<script>
import BrandDTO from '../../../../models/Dtos/Category';
import ProductDTO from '../../../../models/Dtos/ProductDto';
import CategoryVM from '../../../../models/Enities/CategoryVM';
import CategoryService from '../../../../services/CategoryService';
import BrandService from '../../../../services/CategoryService';
import ProductService from '../../../../services/ProductService';
export default {
    data() {
        return {
            product: new ProductDTO(),
            categories: [new CategoryVM()],
            isOk: 0
        }
    },
    props: {
        isEditMode: {
            type: Boolean,
            default: false,
        },
    },
    methods: {
        async getDataCategories() {
            const res = await CategoryService.GetAllCategories();
            this.categories = res.data;
            console.log(res);
        },
        async getDataProduct(productId) {
            if (productId) {
                const res = await ProductService.GetProductById(productId);
                this.product = res.data;
                console.log("Product:  ",this.product);
                console.log("Update");
            }
            else console.log("Add mới");
        },
        async handleSubmit() {
            try {
                console.log(this.product);
                if (this.isEditMode == false) {
                    const res = await ProductService.AddProduct(this.product);
                    if (res.success) {
                        this.$router.push({ name: 'admin-product-list' });
                    }
                }
                else {
                    console.log("Vào else");
                    const res = await ProductService.UpdateProduct(this.product);
                    if (res.success) {
                        this.$router.push({ name: 'admin-product-list' });
                    }
                }
            }
            catch (error) {
                console.log(error);
                this.error = error;
            }
        }
    },
    async created() {
        let productId = this.$route.params.productId;
        console.log(productId);
        if (productId) {
            await this.getDataProduct(productId);
        }
        await this.getDataCategories();
    },

}


</script>

<style>
.success-toast {
    position: fixed;
    top: 100px;
    right: 100px;
    background-color: #38a169;
    color: white;
    padding: 1rem 2rem;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    font-weight: 600;
    z-index: 1000;
    animation: fadeOut 3s forwards;
}

@keyframes fadeOut {
    0% {
        opacity: 1;
    }

    80% {
        opacity: 1;
    }

    100% {
        opacity: 0;
        transform: translateX(100px);
    }
}
</style>