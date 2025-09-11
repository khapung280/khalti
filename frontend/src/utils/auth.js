export const getToken = () => localStorage.getItem('token');

export const isLoggedIn = () => Boolean(getToken());

export const logout = () => {
  localStorage.removeItem('token');
};

export const decodeToken = (token) => {
  if (!token) return null;
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
};

export const getUserId = () => {
  const decoded = decodeToken(getToken());
  return decoded?.userId || null;
};
