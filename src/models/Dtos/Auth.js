class AuthDTO {
    constructor(data = {}) {
        this.username = data.username || "";
        this.email = data.email || "";
        this.password = data.password || "";
    }

    toJSONLogin() {
        return {
            username: this.username,
            password: this.password,
        };
    }
    toJSONRegister() {
        return {
            username: this.username,
            email: this.email,
            password: this.password
        };
    }
}

export default AuthDTO; 
