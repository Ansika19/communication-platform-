
import React from 'react';
import { GoogleLogin } from '@react-oauth/google';

function Login() {
  const handleLoginSuccess = (credentialResponse) => {
    window.location.href = `http://localhost:5000/api/auth/google`;
  };

  return (
    <div>
      <h2>Login with Google</h2>
      <GoogleLogin onSuccess={handleLoginSuccess} />
    </div>
  );
}

export default Login;
