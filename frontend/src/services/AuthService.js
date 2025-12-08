const AuthService = {
    login(email, password) {
        // MOCK DEMO
        if (email === "test@test.se" && password === "123") {
            localStorage.setItem("user", JSON.stringify({ email }));
            return Promise.resolve({ success: true });
        }
        return Promise.resolve({
            success: false,
            message: "Fel email eller lösenord"
        });
    },

    register(name, email, password) {
        // MOCK DEMO – i framtiden API-anrop
        return Promise.resolve({
            success: true,
            message: "Konto skapat!"
        });
    },

    logout() {
        localStorage.removeItem("user");
    }
};

export default AuthService;
