import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          const base64Url = storedToken.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const payload = JSON.parse(window.atob(base64));

          const currentTime = Date.now() / 1000;
          if (payload.exp && payload.exp < currentTime) {
            localStorage.removeItem('token');
          } else {
            setToken(storedToken);
            setUser({
              id: payload.id,
              correo: payload.correo,
              rol: payload.rol,
              nombre: payload.nombre || 'Usuario'
            });
          }
        } catch (error) {
          console.error("Error decodificando token:", error);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const loginContext = (dataJWT) => {
    const storedToken = dataJWT.token;
    localStorage.setItem('token', storedToken);
    
    const base64Url = storedToken.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(window.atob(base64));

    setToken(storedToken);
    setUser({
      id: payload.id,
      correo: payload.correo,
      rol: payload.rol,
      nombre: payload.nombre || 'Usuario'
    });
  };

  const logoutContext = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, loginContext, logoutContext }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Al final de src/context/AuthContext.jsx
import { useContext } from 'react';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};