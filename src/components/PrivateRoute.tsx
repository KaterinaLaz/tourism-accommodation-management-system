import React from 'react'
import { Route, Redirect, RouteProps } from 'react-router-dom'

// Interface defining the props for ProtectedRoute
interface ProtectedRouteProps extends RouteProps {
  component: React.ComponentType<any> // The component to be rendered if the user is authenticated
  isAuthenticated: boolean // Indicates if the user is authenticated or not
}

// ProtectedRoute is a Higher Order Component (HOC) that ensures only authenticated users can access certain routes
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ component: Component, isAuthenticated, ...rest }) => {
  return (
    // The Route renders the specified component or redirects the user
    <Route
      {...rest}
      render={props =>
        isAuthenticated ? (
          // If the user is authenticated, render the component
          <Component {...props} />
        ) : (
          // If not authenticated, redirect to the login page
          <Redirect to="/login" />
        )
      }
    />
  );
};

export default ProtectedRoute