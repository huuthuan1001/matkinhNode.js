<template>
    <header class="site-header" v-if="user.role == 'Admin'">
        <div class=" header-content">
            <div class="logo">
                <a href="/">
                    <img src="./assets/images/logov2.png" alt="Logo Cửa Hàng" width="150">
                </a>
            </div>
            <div class="header-actions " style="display: flex;margin-left: -230px;">
                <button v-if="login == false" class="login-icon" @click="this.$router.push('/login');">Đăng
                    nhập</button>
                <button v-else class="login-icon" @click="Logout()">Đăng xuất</button>
            </div>
        </div>
    </header>
    <header class="site-header" v-else>
        <div class=" header-content">
            <div class="logo">
                <a href="/">
                    <img src="./assets/images/logov2.png" alt="Logo Cửa Hàng" width="150">
                </a>
            </div>
            <nav class="main-nav">
                <ul>
                    <li><a href="/">Trang Chủ</a></li>
                    <!-- <li><a href="/controllers/search">Sản Phẩm</a></li> -->
                    <li><a href="/about">Giới Thiệu</a></li>
                    <li><a href="/contact">Liên Hệ</a></li>
                </ul>
            </nav>
            <div class="header-actions" style="display: flex;margin-left: -70px;">
                <button v-if="login == true" class="cart-icon" @click="$router.push('/users/cart');">🛒</button>
                <button v-if="login == true" class="login-icon" @click="$router.push('/users');">👤</button>
                <button v-if="login == false" class="cart-icon" @click="$router.push('/login');">Đăng nhập</button>
            </div>
        </div>
    </header>
    <div style="min-height: 600px;">
        <router-view @GetInfoUser="GetInfoUser"></router-view>
    </div>
    <!-- <Detail /> -->
    <footer class="site-footer">
        <div class="container footer-content">
            <div class="footer-about">
                <h4>Về Cửa Hàng ABC</h4>
                <p>Chuyên cung cấp mắt kính chính hãng, uy tín, chất lượng.</p>
                <p>Địa chỉ: 123 Đường ABC, Quận XYZ, TP HCM</p>
                <p>Điện thoại: 09xx.xxx.xxx</p>
            </div>
            <div class="footer-links">
                <h4>Liên Kết Hữu Ích</h4>
                <ul>
                    <li><a href="/policy">Chính sách bảo hành</a></li>
                    <li><a href="/terms">Điều khoản sử dụng</a></li>
                    <li><a href="/privacy">Chính sách bảo mật</a></li>
                </ul>
            </div>
            <div class="footer-social">
                <h4>Kết nối với chúng tôi</h4>
                <a href="#">Facebook</a> |
                <a href="#">Instagram</a> |
                <a href="#">Youtube</a>
            </div>
        </div>
        <div class="copyright">
            <p>&copy; 2025 Cửa Hàng Mắt Kính ABC. Bảo lưu mọi quyền.</p>
        </div>
    </footer>
</template>

<script>
import axios from 'axios';
import Detail from './components/Views/Products/Detail.vue';
import UserVM from './models/Enities/UserVM';
import AuthService from './services/authService';
export default {
    components: {
        Detail,
    },

    data() {
        return {
            user: new UserVM(),
            login: false
        }
    },

    methods: {
        async Logout() {
            const res = await AuthService.Logout();
            if (res.code == 200) {
                sessionStorage.removeItem('authToken');
                this.$router.push('/');

            }
        },
        async GetInfoUser() {
            this.login = true;
            const response = await AuthService.GetProfile();
            this.user = response;
            console.log("User đăng nhập: ", this.user);
            if (this.user.role.name == "user") {
                this.$router.push({ path: '/Home' });
            }
            if (this.user.role.name == "admin") {
                this.$router.push({ path: '/admin' });
            }
            // setTimeout(() => {
            //     if (this.user.role.name == "user") {
            //         this.$router.push({ path: '/Home' });
            //     }
            //     if (this.user.role == "Admin") {
            //         this.$router.push({ path: '/admin' });
            //     }
            // }, 0);
            sessionStorage.setItem('User', JSON.stringify(this.user));
        },
        async GetUser() {
            const response = await AuthService.GetProfile();
            this.user = response;
            this.role = this.user.role;
            console.log("User đăng nhập: ", this.user);
            console.log("Role hiện tại: ", this.user.role);
            sessionStorage.setItem('User', JSON.stringify(this.user));
        },
    },
    async created() {
        const userString = sessionStorage.getItem('authToken');
        if (userString == null) {
            console.log("Chưa đăng nhập");
        }
        else {
            await this.GetUser();
            this.login = true;
        }

    },
    // mounted() {
    //     const urlParams = new URLSearchParams(window.location.search);
    //     const token = urlParams.get('token');
    //     if (token) {
    //         console.log('Token received:', token);
    //         // Lưu token vào localStorage
    //         localStorage.setItem('authToken', token);
    //         const currentPath = window.location.pathname;
    //         window.location.href = currentPath;
    //         // this.authenticateWithToken(token);
    //     }
    // },
}
</script>

<style>
.brands {
    background-color: #f5f5f5;
    padding: 20px 0;
}

.brand-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    grid-gap: 20px;
    justify-items: center;
}

.brand-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 10px;
    background-color: #fff;
    border-radius: 5px;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
}

.brand-item img {
    width: 100px;
    height: 100px;
    object-fit: contain;
    margin-bottom: 10px;
}

.brand-item h3 {
    font-size: 18px;
    margin-top: 0;
}


/* From Uiverse.io by alexruix */
.group {
    display: flex;
    line-height: 28px;
    align-items: center;
    position: relative;
    max-width: 190px;
}

.input {
    width: 100%;
    height: 40px;
    line-height: 28px;
    padding: 0 1rem;
    padding-left: 2.5rem;
    border: 2px solid transparent;
    border-radius: 8px;
    outline: none;
    background-color: #f3f3f4;
    color: #0d0c22;
    transition: .3s ease;
}

.input::placeholder {
    color: #9e9ea7;
}

.input:focus,
input:hover {
    outline: none;
    border-color: rgba(234, 76, 137, 0.4);
    background-color: #fff;
    box-shadow: 0 0 0 4px rgb(234 76 137 / 10%);
}

.icon {
    position: absolute;
    left: 1rem;
    fill: #9e9ea7;
    width: 1rem;
    height: 1rem;
}
</style>
