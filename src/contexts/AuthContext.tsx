import React, { createContext, useContext, useState, useEffect } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  user: any | null;
  token: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is already logged in
    const storedToken = localStorage.getItem("admin_token");
    const userData = localStorage.getItem("admin_user");

    if (storedToken && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setToken(storedToken);
        setIsAuthenticated(true);
        setUser(parsedUser);
      } catch (error) {
        localStorage.removeItem("admin_token");
        localStorage.removeItem("admin_user");
      }
    }

    setIsLoading(false);
  }, []);

  const login = async (
    username: string,
    password: string
  ): Promise<boolean> => {
    // Simple fixed authentication
    if (username === "admin" && password === "admin123") {
      const userData = {
        id: 1,
        username: "admin",
        role: "admin",
        email: "admin@example.com",
      };
      const token = "admin-token-" + Date.now();

      // Set authentication data
      localStorage.setItem("admin_token", token);
      localStorage.setItem("admin_user", JSON.stringify(userData));

      // Update state immediately
      setToken(token);
      setIsAuthenticated(true);
      setUser(userData);

      return true;
    }

    return false;
  };

  const logout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    setToken(null);
    setIsAuthenticated(false);
    setUser(null);
  };

  const value = {
    isAuthenticated,
    isLoading,
    login,
    logout,
    user,
    token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
