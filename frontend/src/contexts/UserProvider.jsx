import { createContext, useContext, useEffect, useState } from "react"
import { useAxios } from "./AxiosProvider";
import { useNavigate } from "react-router-dom";

const userContext = createContext({
    user: undefined,
    handleLogin: (data) => null,
    handleLogout: () => null
});

const UserProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true); // Aggiunto
  const myaxios = useAxios();
  const navigate = useNavigate();

   useEffect(() => {
  const savedUser = localStorage.getItem("user");
  const savedToken = localStorage.getItem("token");
  if (savedUser && savedToken) {
    setUser(JSON.parse(savedUser));
  }
  setLoading(false);
}, []);

  const handleLogin = async (data) => {
    try {
      const result = await myaxios.post('/auth/login', data);
      localStorage.setItem('token', result.data.token);
      localStorage.setItem('user', JSON.stringify(result.data.user));
      setUser(result.data.user);
      return null;
    } catch (error) {
      return error.response?.data?.message || 'Errore durante il login';
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(undefined);
    navigate('/login');
  };

const handleUpdateUser = (newUser) => {
  const mergedUser = { ...user, ...newUser };
  setUser(mergedUser);
  localStorage.setItem("user", JSON.stringify(mergedUser));
};
  const isAuthenticated = !!user;



  return (
    <userContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        handleLogin,
        handleLogout,
        handleUpdateUser
      }}
    >
      {children}
    </userContext.Provider>
  );
};

export default UserProvider;

export const useUser = () => {
    return useContext(userContext);
}