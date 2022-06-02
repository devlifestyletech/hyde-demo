import React from 'react';
import { Navigate, useOutlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function NoAuthLayout() {
  const { isSignIn } = useAuth();
  const location = useLocation();
  const outlet = useOutlet();

  if (isSignIn)
    return (
      <Navigate to="/dashboard/summary" state={{ from: location }} replace />
    );
  return <>{outlet}</>;
}

export default NoAuthLayout;
