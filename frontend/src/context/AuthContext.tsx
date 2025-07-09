import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

type AuthContextType = {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setIsAuthenticated(!!token);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await axios.post("http://localhost:8000/api/login/", {
        email,
        password,
      });
      const { access } = res.data;
      localStorage.setItem("accessToken", access);
      setIsAuthenticated(true);
      toast.success("Login successful");
      navigate("/dashboard");
    } catch (err) {
      toast.error("Login failed");
    }
  };

  const signup = async (email: string, password: string) => {
    try {
      const res = await axios.post("http://localhost:8000/api/signup/", {
        email,
        password,
      });
      const { access } = res.data;
      localStorage.setItem("accessToken", access);
      setIsAuthenticated(true);
      toast.success("Signup successful");
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Signup failed");
    }
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    setIsAuthenticated(false);
    toast.info("Logged out");
    navigate("/");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext)!;
