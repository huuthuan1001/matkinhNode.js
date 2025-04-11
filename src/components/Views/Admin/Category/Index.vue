<template>
    <div class="brand-list-container">
        <h1>Quản lý loại mắt kính</h1>

        <div class="actions">
            <router-link :to="{ name: 'admin-category-add' }" class="btn btn-add">
                <i class="fas fa-plus"></i> Thêm loại mới
            </router-link>
        </div>

        <div v-if="isLoading" class="loading-indicator">
            <p>Đang tải dữ liệu...</p>
        </div>

        <div v-if="error" class="error-message">
            {{ error }}
        </div>

        <div v-if="!isLoading && !error" class="brand-table-container">
            <table class="brand-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <!-- <th>Logo</th> -->
                        <th>Tên loại</th>
                        <th>Mô tả</th>
                        <th>Ngày tạo</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="categories.length === 0">
                        <td colspan="5" class="no-data">Không có dữ liệu loại mắt kính.</td>
                    </tr>
                    <tr v-for="item in categories" :key="item.id">
                        <td>{{ item.id }}</td>
                        <!-- <td>
                             <img v-if="brand.logo" :src="getImageUrl(brand.logo)" alt="Logo" class="brand-logo" /> 
                             <span v-else>N/A</span> 
                        </td> -->
                        <td>{{ item.name }}</td>
                        <td>{{ item.description }}</td>
                        <td>{{ formatDate(item.created_at) }}</td>
                        <td>
                            <router-link :to="{ name: 'admin-category-edit', params: { categoryId: item._id } }"
                                class="btn btn-edit" title="Sửa">
                                <i class="fas fa-edit"></i>
                            </router-link>
                            <button @click="confirmDelete(item._id)" class="btn btn-delete" title="Xóa">
                                <i class="fas fa-trash-alt"></i>
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import CategoryDTO from '../../../../models/Dtos/Category';
import CategoryService from '../../../../services/CategoryService';

export default {
    data() {
        return {
            categories: [new CategoryDTO()],
            isLoading: false,
            error: null
        }
    },

    methods: {
        // Hàm định dạng ngày tháng
        formatDate(dateString) {
            if (!dateString) return 'N/A';
            try {
                const date = new Date(dateString);
                return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
            } catch (e) { return 'Invalid Date'; }
        },
        async fetchCategories() {
            this.isLoading = true;
            this.error = null;
            try {
                const response = await CategoryService.GetAllCategories();
                console.log(response);
                this.isLoading = false;
                this.categories = response.data;
            } catch (err) {
                console.error('Lỗi khi tải danh sách sản phẩm:', err);
                this.error = `Không thể tải danh sách sản phẩm. Lỗi: ${err.message || err}`;
                this.brands = [];
            } finally {
                this.isLoading = false;
            }
        },


        // --- Delete Product ---
        confirmDelete(id) {
            if (window.confirm(`Bạn có chắc chắn muốn xóa loại mắt kính có ID ${id}?`)) {
                this.deleteCategory(id);
            }
        },

        async deleteCategory(id) {
            const originalError = this.error; // Lưu lỗi cũ
            this.error = null;
            try {
                await CategoryService.DeleteCategory(id);
                alert(`Đã xóa thành công loại mắt kính ID ${id}.`);
                this.fetchCategories();
            } catch (err) {
                if (originalError && !this.error) {
                    this.error = originalError;
                }
            }
        },
    },
    async created() {
        await this.fetchCategories();
    },
}
</script>

<style scoped>
/* Responsive (Tùy chọn) */
@media (max-width: 768px) {

    .brand-table th,
    .brand-table td {
        padding: 8px;
        font-size: 0.9em;
    }

    .btn {
        padding: 6px 10px;
        font-size: 0.8rem;
    }

    .brand-logo {
        max-width: 40px;
    }
}
</style>