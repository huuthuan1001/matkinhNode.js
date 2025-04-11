class CategoryDTO {
  constructor(data = {}) {
    this.name = data.name || "";
    this.description = data.description || null; // Giả định đây là đối tượng File khi gửi đi
  }

  toJSON() {
    const json = {};
    if (this.name !== null) json.name = this.name;
    if (this.description !== null) json.description = this.description;
    return json;
  }
}

export default CategoryDTO;
