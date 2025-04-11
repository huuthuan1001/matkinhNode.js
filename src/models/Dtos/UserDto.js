class UserDTO {
  constructor(data = {}) {
    this.username = data.username || "";
    this.fullName = data.fullName || "";
    this.avatarUrl = data.avatarUrl || "";
    this.email = data.email || "";
    this.role = data.role || null;
  }

  toJSON() {
    const json = {};
    if (this.username) {
      json.username = this.username;
    }
    if (this.fullName) {
      json.fullName = this.fullName;
    }
    if (this.avatarUrl) {
      json.avatarUrl = this.avatarUrl;
    }
    if (this.email) {
      json.email = this.email;
    }
    if (this.role !== null) {
      json.role = this.role;
    }
    return json;
  }
}

export default UserDTO;
