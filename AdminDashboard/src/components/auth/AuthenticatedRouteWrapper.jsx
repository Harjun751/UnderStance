import React from 'react';
import { withAuthenticationRequired } from '@auth0/auth0-react';

const base = ({ children }) => { return <>{children}</>;};

export default withAuthenticationRequired(base, {
  onRedirecting: () => (<div>Redirecting you to the login page...</div>)
})
