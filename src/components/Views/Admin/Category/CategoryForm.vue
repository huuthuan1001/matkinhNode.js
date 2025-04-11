<template>
    <div class="brand-form-container">
        <h2>{{ isEditMode ? 'Cập nhật loại mắt kính' : 'Thêm loại mắt kính mới' }}</h2>
        <form @submit.prevent="handleSubmit" class="brand-form">
            <div v-if="error" class="error-message">
                {{ error }}
            </div>
            <div v-if="success" class="success-message">
                {{ success }}
            </div>

            <div class="form-group">
                <label for="name">Tên loại:</label>
                <input type="text" id="name" v-model="categoryDto.name" required placeholder="Nhập tên loại mắt kính" />
            </div>
            <div class="form-group">
                <label for="description">Mô tả:</label>
                <input type="text" id="description" v-model="categoryDto.description" required
                    placeholder="Nhập mô tả loại mắt kính" />
            </div>

            <div class="form-actions">
                <button type="submit" :disabled="isLoading" class="btn-submit">
                    {{ isLoading ? 'Đang xử lý...' : (isEditMode ? 'Cập nhật' : 'Thêm mới') }}
                </button>
                <router-link :to="{ name: 'admin-categories' }" class="btn-cancel">
                    Hủy bỏ
                </router-link>
            </div>
        </form>
    </div>
</template>

<script>
import BrandService from '../../../../services/CategoryService'; // Đảm bảo đường dẫn đúng
import CategoryDTO from '../../../../models/Dtos/Category'; // Đảm bảo đường dẫn đúng
import CategoryService from '../../../../services/CategoryService';
export default {
    data() {
        return {
            categoryDto: new CategoryDTO(),
            error: ""
        }
    },
    props: {
        categoryId: {
            type: [String, Number],
            required: false,
        },
        isEditMode: {
            type: Boolean,
            default: false,
        },
    },
    methods: {
        async handleSubmit() {
            try {
                console.log(this.isEditMode);
                if (this.isEditMode == false) {
                    const res = await CategoryService.AddCategory(this.categoryDto);
                    if (res.success) {
                        this.$router.push({ name: 'admin-categories' });
                    }
                }
                else {
                    let categoryId = this.$route.params.categoryId;
                    const res = await CategoryService.UpdateCategory(categoryId,this.categoryDto);
                    if (res.success) {
                        this.$router.push({ name: 'admin-categories' });
                    }
                }
            }
            catch (error) {
                this.error = error;
            }
        },
        async getDataCategory(id) {
            try {
                const res = await CategoryService.GetCategoryById(id);
                console.log(res);
                this.categoryDto = res.data;
            } catch (error) {
                console.error("Lỗi khi tải loại:", error);
            }
        },
    },
    async created() {
        let categoryId = this.$route.params.categoryId;
        if (categoryId) {
            console.log("Sửa", categoryId);
            await this.getDataCategory(categoryId);
        }
        else {
            console.log("Thêm mới")
        }
    },

}

</script>

<style></style>