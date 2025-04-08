let userModel = require("../schemas/user");
let roleModel = require("../schemas/role");
let bcrypt = require("bcrypt");

module.exports = {
  GetAllUsers: async function () {
    return await userModel.find({
      status: false,
    });
  },
  GetUserByID: async function (id) {
    return await userModel.findById(id).populate({
      path: "role",
      select: "name",
    });
  },
  GetUserByEmail: async function (email) {
    return await userModel
      .findOne({
        email: email,
      })
      .populate({
        path: "role",
        select: "name",
      });
  },
  GetUserByToken: async function (token) {
    return await userModel
      .findOne({
        resetPasswordToken: token,
      })
      .populate({
        path: "role",
        select: "name",
      });
  },
  GetUserByUsername: async function (username) {
    return await userModel
      .findOne({
        username: username,
      })
      .populate("role");
  },
  // controllers/users.js -> Sửa lại CreateAnUser
  CreateAnUser: async function (username, password, email, rolename) {
    try {
      let role = await roleModel.findOne({ name: rolename });
      if (!role) {
        throw new Error("Role không tồn tại: " + rolename);
      }
      const existingUser = await userModel.findOne({ email: email });
      if (existingUser) {
        throw new Error("Email đã tồn tại: " + email);
      }

      let user = new userModel({
        username: username,
        // --- TRUYỀN MẬT KHẨU GỐC VÀO ĐÂY ---
        password: password, // Để pre('save') hook tự xử lý hash
        email: email,
        role: role._id,
      });
      return await user.save(); // Hook pre('save') sẽ hash trước khi lưu
    } catch (error) {
      throw error;
    }
  },
  UpdateAnUser: async function (id, body) {
    try {
      let user = await userModel.findById(id);
      let allowField = ["password", "email", "urlImg", "role"];
      for (const key of Object.keys(body)) {
        if (allowField.includes(key)) {
          user[key] = body[key];
        }
      }
      return await user.save();
    } catch (error) {
      throw new Error(error.message);
    }
  },
  DeleteAnUser: async function (id) {
    try {
      return await userModel.findByIdAndUpdate(id, {
        status: false,
      });
    } catch (error) {
      throw new Error(error.message);
    }
  },
  CheckLogin: async function (username, password) {
    let user = await this.GetUserByUsername(username);
    if (!user) {
      throw new Error("Username hoac password khong dung");
    } else {
      if (bcrypt.compareSync(password, user.password)) {
        return user._id;
      } else {
        throw new Error("Username hoac password khong dung");
      }
    }
  },
  ChangePassword: async function (user, oldpassword, newpassword) {
    if (bcrypt.compareSync(oldpassword, user.password)) {
      user.password = newpassword;
      return await user.save();
    } else {
      throw new Error("oldpassword khong dung");
    }
  },
};
