export default class UserVM {
    constructor(data = {}) {
        this.id = data.userId || data.id || null;       // Lấy từ userId hoặc id
        this.username = data.username || "";             // Mặc định là chuỗi rỗng
        this.fullName = data.fullname || "";             // Mặc định là chuỗi rỗng
        this.avatarUrl = data.avatarUrl || "";                   // Mặc định là chuỗi rỗng
        this.email = data.email || "";                   // Mặc định là chuỗi rỗng              // Mặc định là chuỗi rỗng
        this.role = data.role || null;               // Mặc định là null
    }
}
