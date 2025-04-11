<template>
    <div class="product-list-container">
        <h1>Quản lý Sản phẩm</h1>

        <div class="actions">
            <router-link :to="{ name: 'admin-product-add', params: { productId: 0 } }" class="btn btn-add">
                <i class="fas fa-plus"></i> Thêm Sản phẩm mới
            </router-link>
        </div>

        <div v-if="isLoading" class="loading-indicator">
            <p>Đang tải dữ liệu sản phẩm...</p>
        </div>

        <div v-if="error" class="error-message">
            {{ error }}
        </div>

        <div v-if="!isLoading && !error" class="product-table-container">
            <table class="product-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Tên Sản phẩm</th>
                        <th>Giá (VNĐ)</th>
                        <th>Loại mắt kính</th>
                        <th>Ngày tạo</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="products.length === 0">
                        <td colspan="7" class="no-data">Không có dữ liệu sản phẩm.</td>
                    </tr>
                    <tr v-for="product in products" :key="product._id">
                        <td>{{ product.id }}</td>
                        <td>{{ product.name }}</td>
                        <td>{{ formatPrice(product.price) }}</td>
                        <td>{{ product.category.name || 'N/A' }}</td>
                        <td>{{ formatDate(product.created_at) || 'N/A' }}</td>
                        <td>
                            <button @click="confirmDelete(product._id)" class="btn btn-delete" title="Xóa">
                                <i class="fas fa-trash-alt"></i>
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div v-if="!isLoading && totalPages > 1" class="pagination">
            <button @click="changePage(currentPage - 1)" :disabled="currentPage <= 1">
                &laquo; Trước
            </button>
            <span>Trang {{ currentPage }} / {{ totalPages }}</span>
            <button @click="changePage(currentPage + 1)" :disabled="currentPage >= totalPages">
                Sau &raquo;
            </button>
        </div>

    </div>
</template>
<script>
import UserVM from '../../../models/Enities/UserVM';
import UserService from '../../../services/UserService';
export default {

    data() {
        return {
            user: [new UserVM()],
            isLoading: false,
            error: null
        }
    },

    methods: {
        
        async fetchUsers() {
            this.isLoading = true;
            this.error = null;
            this.products = [];
            try {
                const response = await UserService.GetAllUsers();
                console.log(response);
                this.user = response.data || [];
                this.isLoading = false;
            } catch (err) {
                console.error('Lỗi khi tải danh sách người dùng:', err);
                this.error = `Không thể tải danh sách người dùng. Lỗi: ${err.message || err}`;
                this.products = [];
                this.totalItems = 0;
            } finally {
                this.isLoading = false;
            }
        },


        // --- Delete Product ---
        confirmDelete(id) {
            if (window.confirm(`Bạn có chắc chắn muốn xóa người dùng có ID ${id}?`)) {
                this.deleteProduct(id);
            }
        },

        async deleteProduct(id) {
            const originalError = this.error; // Lưu lỗi cũ
            this.error = null;
            try {
                await ProductService.DeleteProduct(id);
                alert(`Đã xóa thành công người dùng ID ${id}.`);
                this.fetchProducts();
            } catch (err) {
                if (originalError && !this.error) {
                    this.error = originalError;
                }
            }
        },
    },
    async created() {
        await this.fetchUsers();
    },

}
</script>
<style scoped>
</style>