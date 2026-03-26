export const clearAuthStorage = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('token_expires');
  localStorage.removeItem('role');
  localStorage.removeItem('user');
};
