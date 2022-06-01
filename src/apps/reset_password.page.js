import React from 'react';
import { useSearchParams } from 'react-router-dom';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  console.log(searchParams);
  return <>{searchParams}</>;
}
