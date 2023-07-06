import React from 'react';
import Login from '~/shared/components/Login/Login';
import {
  useLocation
} from 'react-router';
import Register from '~/shared/components/Register/Register';

const AuthPage = () => {
  const path = useLocation().pathname.split('/').at(-1);

  return (
    <>
      {path === 'login' && <Login/>}
      {path === 'register' && <Register/>}
    </>
  );
};

export default AuthPage;
