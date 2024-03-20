import React,{useState} from "react";
import { Outlet, useNavigate } from "react-router-dom"
import Navbar from "./components/Navbar"
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [token,setToken] = useState(localStorage.getItem('token'));
  const navigate = useNavigate();
  React.useEffect(() => {
    if (token) {
      fetch('https://coalesce-sos6.onrender.com/user', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
          }
          return res.json();
        })
        .then((data) => {
          setUserData(data);
          setIsAuthenticated(true);
          setIsLoading(false);
        })
        .catch((error) => {
          setIsLoading(false);
          console.error('Error:', error);
        });
    } else {
      console.log('Please log in');
      setIsLoading(false);
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
    navigate({ pathname: '/login', state: { isAuthenticated: isAuthenticated } });
  };
  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  return (
    <>
    <Navbar isAuthenticated={isAuthenticated} handleLogout={handleLogout} userData={userData} isLoading={isLoading} handleLogin={handleLogin}/>
    <Outlet/>
    </>
  );
}

export default App;
