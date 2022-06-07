import * as React from 'react';
import { Route } from 'react-router-dom';
import MainPage from '../apps/main.page';
export default function AuthorizationRoute() {
  return (
    // <React.Fragment>
    <Route path="summary" element={<MainPage />} />
    // </React.Fragment>
  );
}
