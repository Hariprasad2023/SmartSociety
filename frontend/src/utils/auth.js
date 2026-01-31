export const isLoggedIn = () => !!localStorage.getItem("token");

export const getRole = () => localStorage.getItem("role"); // "Admin" | "Resident" | "Security"

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  window.location.href = "/";
};
