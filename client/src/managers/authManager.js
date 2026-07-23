import { API_BASE } from "./apiConfig";

const _apiUrl = `${API_BASE}/auth`;

export const login = (username, password) => {
    return fetch(_apiUrl + "/login", {
        method: "POST",
        credentials: "include",
        headers: {
            Authorization: `Basic ${btoa(`${username}:${password}`)}`,
        },
    }).then((res) => {
        if (res.status !== 200) {
            return Promise.resolve(null);
        } else {
            return tryGetLoggedInUser();
        }
    });
};

export const logout = () => {
    return fetch(_apiUrl + "/logout", { credentials: "include" });
};

export const tryGetLoggedInUser = (signal) => {
    return fetch(_apiUrl + "/me", { credentials: "include", signal }).then((res) => {
        return res.status === 401 ? Promise.resolve(null) : res.json();
    });
};

export const register = (userProfile) => {
    userProfile.password = btoa(userProfile.password);
    return fetch(_apiUrl + "/register", {
        credentials: "include",
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userProfile),
    }).then(() => tryGetLoggedInUser());
};