import { jwtDecode } from "jwt-decode";

function isAuthenticated() {
    const token = localStorage.getItem('token');
    if (!token) return false;

    try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        return decoded.exp > currentTime;
    } catch (error) {
        console.error("Token decoding failed:", error);
        return false;
    }
}

export default isAuthenticated;
