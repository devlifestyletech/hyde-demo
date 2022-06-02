import React from 'react';
import { useSearchParams } from 'react-router-dom';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  let code = searchParams.get('code');
  return <>{code}</>;
}
