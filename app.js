var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
let cors = require("cors");
let { CreateErrorRes } = require("./utils/responseHandler");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var cartRouter = require("./routes/cart");
var orderRoutes = require("./routes/order");
var app = express();
app.use(
  cors({
    origin: "*",
  })
);

mongoose.connect("mongodb://127.0.0.1:27017/S5");

mongoose.connection.on("connected", async () => {
  console.log("MongoDB connected");

  // ✅ Seed 2 role: admin và user
  const Role = require("./schemas/role");
  const roles = [
    { name: "admin", description: "Quản trị viên" },
    { name: "user", description: "Người dùng thường" },
  ];

  for (const roleData of roles) {
    const exists = await Role.findOne({ name: roleData.name });
    if (!exists) {
      await Role.create(roleData);
      console.log(`✅ Role '${roleData.name}' đã được tạo.`);
    } else {
      console.log(`ℹ️ Role '${roleData.name}' đã tồn tại.`);
    }
  }
});

// Sử dụng HTML tĩnh
app.use(express.static(path.join(__dirname, "public")));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser("NNPTUD"));

// Các route
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/roles", require("./routes/roles"));
app.use("/menus", require("./routes/menus"));
app.use("/auth", require("./routes/auth"));
app.use("/products", require("./routes/products"));
app.use("/categories", require("./routes/categories"));
app.use("/cart", cartRouter);
app.use("/orders", orderRoutes);

// Xử lý lỗi 404
app.use(function (req, res, next) {
  next(createError(404));
});

// Xử lý lỗi chung
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  // res.locals.error = req.app.get("env") === "development" ? err : {};
  CreateErrorRes(res, err.message, err.status || 500);
});

module.exports = app;

// Khởi động server
var port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`🚀 Server is running on http://localhost:${port}`);
});
