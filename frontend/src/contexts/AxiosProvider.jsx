import axios from "axios";
import { createContext, useContext, useEffect } from "react"
import { useNavigate } from "react-router-dom";

const axiosContext = createContext();

const myaxios = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
    headers: {
        'Accept': 'application/json',
    }
});

const AxiosProvider = ({ children }) => {
    const navigate = useNavigate();
    /* const [firstLoad, setFirstLoad] = useState(false); */

   useEffect(() => {
  const reqInterceptor = myaxios.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }, error => Promise.reject(error));

  const resInterceptor = myaxios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        if (window.location.pathname !== '/login') {
          navigate('/login');
        }
      }
      return Promise.reject(error);
    }
  );

  return () => {
    myaxios.interceptors.request.eject(reqInterceptor);
    myaxios.interceptors.response.eject(resInterceptor);
  };
}, [navigate]);


    return <axiosContext.Provider value={myaxios}>
        {children}
    </axiosContext.Provider>;
}

export default AxiosProvider;


export const useAxios = () => useContext(axiosContext);