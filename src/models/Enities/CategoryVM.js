export default class CategoryVM{
    constructor(data = {}) {        
        this.id = data.id ||  null;
        this.name = data.name || "";
        this.description = data.description || "";
    }
}
