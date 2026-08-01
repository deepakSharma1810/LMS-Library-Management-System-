import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("adminToken"));
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null,
  );

  const login = (token, user) => {
    localStorage.setItem("adminToken", token);
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("userId", user._id);

    setToken(token);
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("user");
    localStorage.removeItem("userId");

    setToken(null);
    setUser(null);
  };

  useEffect(() => {
    setToken(localStorage.getItem("adminToken"));
    setUser(JSON.parse(localStorage.getItem("user")));
  }, []);

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
