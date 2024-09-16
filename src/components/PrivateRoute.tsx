import React from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';
import { useAuth } from './AuthContext';

// Interface defining the props for ProtectedRoute
interface ProtectedRouteProps extends RouteProps {
  component: React.ComponentType<any>; // The component to be rendered if the user is authenticated
  isAuthenticated: boolean; // Indicates if the user is authenticated or not
  allowedRoles?: string[]; // Array of roles allowed to access this route (optional now)
}

// ProtectedRoute ensures only authenticated users with specific roles can access certain routes
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ component: Component, isAuthenticated, allowedRoles, ...rest }) => {
  const { role } = useAuth();  // Get the user's role from AuthContext

  return (
    <Route
      {...rest}
      render={props =>
        isAuthenticated ? (
          // Check if the user's role is allowed to access the route if allowedRoles is provided
          allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(role!) ? (
            <Redirect to="/app/not-authorized" />  // Redirect if role is not allowed
          ) : (
            <Component {...props} />  // Render the component if authenticated and role is allowed
          )
        ) : (
          // If not authenticated, redirect to the login page
          <Redirect to="/login" />
        )
      }
    />
  );
};

export default ProtectedRoute;
