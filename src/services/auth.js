const TOKEN_KEY = "desafio-token";
export const isAuthenticated = () => localStorage.getItem(TOKEN_KEY) !== null;
export const getUserName = () => localStorage.getItem('username');
export const setUserName = (username) => localStorage.setItem('username', username);
export const getRoles = () => JSON.parse(localStorage.getItem('roles'));
export const setRoles = (roles) => localStorage.setItem('roles', JSON.stringify(roles));
export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = token => {
    localStorage.setItem(TOKEN_KEY, token);
}
export const logout = () => localStorage.removeItem(TOKEN_KEY);