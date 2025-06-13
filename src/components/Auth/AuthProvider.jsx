import { createContext, useEffect, useState } from "react";

import { AuthContext } from "../../hooks/useAuth";
import { authService } from "../../services/authService";

// export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);



  const login = async (email, password) => {
    const result = await authService.login(email, password);

    if (result.success) {
      setUser(result.data);
      setIsLoggedIn(true);
    }

    return result;
  };

  const register = async (username, email, password) => {
    return await authService.register(username, email, password);
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
