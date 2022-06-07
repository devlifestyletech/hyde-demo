import { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { encryptStorage } from '../utils/encryptStorage';
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isSignIn, setIsSignIn] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      let session = await encryptStorage.getItem('user_session');
      if (session) {
        setIsSignIn(true);
      }
    })();
  }, []);

  const signin = async () => {
    const from = location.state?.from || '/dashboard/summary';
    setIsSignIn(true);
    console.log('from: ', from);
    navigate(from, { replace: true });
  };

  const signout = async () => {
    setIsSignIn(false);
    navigate('/', { replace: true });
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const value = useMemo(() => ({ isSignIn, signin, signout }), [isSignIn]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  return useContext(AuthContext);
};
