import { createContext, useState, useEffect } from "react";
import { baseUri } from "../components/Common/ConstantLink";


export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // ✅ Get token from cookies
  const getTokenFromCookie = () => {
    const match = document.cookie.match(new RegExp("(^| )token=([^;]+)"));
    return match ? match[2] : null;
  };

  // ✅ Move validateAuth outside useEffect so you can expose it
  const validateAuth = async () => {
    const token = getTokenFromCookie();

    if (token) {
      try {
        const res = await fetch(`${baseUri}/api/auth/validateToken`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data.user || null); // If backend sends user data
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (err) {
        console.error("Token validation failed:", err);
        setIsAuthenticated(false);
        setUser(null);
      }
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  // ✅ Automatically run it once when component mounts
  useEffect(() => {
    validateAuth();
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        isAuthenticated,
        setIsAuthenticated,
        validateAuth, // Now it's defined and exposed correctly
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
