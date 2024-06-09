import React, { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { AuthContext } from '../contextProvider/AuthContext'

// ProtectedRoute component definition
function ProtectedRoute({element: Component, ...rest}) {
  
    // Get the 'authState' value from the AuthContext
    const { authState } = useContext(AuthContext)

    // Conditionally render the protected component or navigate to the login page
    return authState.status ? <Component /> : <Navigate to = "/login" />
}

export default ProtectedRoute
