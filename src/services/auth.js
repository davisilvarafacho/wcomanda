import axios from "axios";

export const auth = axios.create({
    baseURL: import.meta.env.VITE_AUTH_URL,
})
