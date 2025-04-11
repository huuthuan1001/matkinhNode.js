

const adminRoutes = [
  {
    path: "/admin",
    component: () => import("../../components/Views/Home/ViewAdminEmployee.vue"),
    meta: { requiresAuth: true, requiresRole: 'admin' },
    children: [
      {
        path: '',
        name: 'admin-dashboard',
        component: () => import('../../components/Views/Admin/AdminDashboard.vue'),
      },
      // --- Quản lý Sản phẩm ---
      {
        path: 'products', // URL: /admin/products
        name: 'admin-product-list',
        component: () => import('../../components/Views/Admin/Product/ProductList.vue'),
      },
      {
        path: 'products/add',
        name: 'admin-product-add',
        component: () => import('../../components/Views/Admin/Product/ProductForm.vue'),
        props: { isEditMode: false } // Truyền props để biết là chế độ thêm mới
      },
      {
        path: 'products/edit/:productId', // URL: /admin/products/edit/123
        name: 'admin-product-edit',
        component: () => import('../../components/Views/Admin/Product/ProductForm.vue'),
        props: route => ({ isEditMode: true, productId: route.params.productId }) // Truyền props để biết là edit và lấy productId
      },
      // --- Quản lý Thương hiệu ---
      {
        path: 'categories', // URL: /admin/brands
        name: 'admin-categories',
        component: () => import('../../components/Views/Admin/Category/Index.vue'), // Trang danh sách thương hiệu (cần tạo)
      },
      {
        path: 'category/add', // URL: /admin/brands/add
        name: 'admin-category-add',
        component: () => import('../../components/Views/Admin/Category/CategoryForm.vue'), // Trang thêm thương hiệu (cần tạo)
        props: { isEditMode: false }
      },
      {
        path: 'category/edit/:categoryId', // URL: /admin/brands/edit/456
        name: 'admin-category-edit',
        component: () => import('../../components/Views/Admin/Category/CategoryForm.vue'), // Dùng chung form
        props: route => ({ isEditMode: true, categoryId: route.params.categoryId })
      },
      // --- Thêm các route quản lý khác (Orders, Users,...) tương tự ---
       {
        path: 'orders', // URL: /admin/orders
        name: 'admin-order-list',
        component: () => import('../../components/Views/Admin/OrderList.vue'), // Cần tạo OrderList.vue
      },
       {
        path: 'users', // URL: /admin/users
        name: 'admin-user-list',
        component: () => import('../../components/Views/Admin/UserList.vue'), // Cần tạo UserList.vue
      },
    ],
  },
];

export default adminRoutes;