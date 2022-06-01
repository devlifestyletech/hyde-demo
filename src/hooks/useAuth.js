import { createContext, useContext, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isSignIn, setIsSignIn] = useState(true);
  const navigate = useNavigate();

  const signin = async () => {
    setIsSignIn(true);
    navigate('/dashboard/summary');
  };

  const signout = async () => {
    setIsSignIn(false);
    navigate('/', { replace: true });
  };

  const value = useMemo(() => ({ isSignIn, signin, signout }), [isSignIn]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  return useContext(AuthContext);
};
