import axios from "axios";

const api = axios.create({
    baseURL: "https://levelup-server-ppvx.onrender.com/api",
});

export default api;