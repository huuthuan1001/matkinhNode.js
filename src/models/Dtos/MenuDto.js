class MenuDTO {
  constructor(data = {}) {
    this.text = data.text || "";
    this.url = data.url || "";
    this.parent = data.parent || "";
  }

  toJSON() {
    const json = {};

    if (this.text) {
      json.text = this.text;
    }
    if (this.url) {
      json.url = this.url;
    }
    if (this.parent) {
      json.parent = this.parent;
    }

    return json;
  }
}

export default CategoryDTO;
