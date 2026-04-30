import { useEffect, useState, createContext } from "react";

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    // Check if user is logged in (using sessionStorage instead of localStorage)
    const token = sessionStorage.getItem("token");
    const userData = sessionStorage.getItem("user");

    if (token && userData) {
      setIsLoggedIn(true);
      setUser(JSON.parse(userData));
    }
    setLoading(false); // Done checking
  }, []);

  const login = (userData, token) => {
    sessionStorage.setItem("token", token);
    sessionStorage.setItem("user", JSON.stringify(userData));
    setIsLoggedIn(true);
    setUser(userData);
  };

  const logout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ isLoggedIn, setIsLoggedIn, user, login, logout, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };