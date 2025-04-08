document.addEventListener("DOMContentLoaded", () => {
  const productForm = document.getElementById("productForm");
  const productList = document.getElementById("productList");

  async function fetchProducts() {
    const res = await fetch("/products");
    const result = await res.json();
    if (result.success) {
      productList.innerHTML = "";
      result.data.forEach((product) => {
        const div = document.createElement("div");
        div.className = "product-item";
        div.innerHTML = `
          <div>
            <strong>${product.name}</strong> - ${product.price} VND<br/>
            <em>${product.description}</em>
          </div>
          <div>
            <button onclick="deleteProduct('${product._id}')">Xóa</button>
          </div>
        `;
        productList.appendChild(div);
      });
    }
  }

  productForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = {
      name: document.getElementById("name").value,
      description: document.getElementById("description").value,
      price: document.getElementById("price").value,
      category: document.getElementById("category").value,
    };

    const res = await fetch("/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      productForm.reset();
      fetchProducts();
    } else {
      alert("Thêm sản phẩm thất bại!");
    }
  });

  window.deleteProduct = async (id) => {
    const res = await fetch(`/products/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      fetchProducts();
    }
  };

  fetchProducts();
});
