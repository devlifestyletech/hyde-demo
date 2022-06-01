import React from 'react';
import { Navigate, useOutlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function NoAuthLayout() {
  const { isSignIn } = useAuth();
  const outlet = useOutlet();

  if (isSignIn) return <Navigate to="/dashboard/summary" replace />;
  return <>{outlet}</>;
}

export default NoAuthLayout;
