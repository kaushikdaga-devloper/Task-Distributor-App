import React, { createContext, useReducer, useContext } from 'react'

const AuthStateContext = createContext()
const AuthDispatchContext = createContext()

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      localStorage.setItem('token', action.payload.token)
      return { ...state, isAuthenticated: true, token: action.payload.token }
    case 'LOGOUT':
      localStorage.removeItem('token')
      return { ...state, isAuthenticated: false, token: null }
    default:
      throw new Error(`Unknown action: ${action.type}`)
  }
}

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    isAuthenticated: !!localStorage.getItem('token'),
    token: localStorage.getItem('token'),
  })

  return (
    <AuthStateContext.Provider value={state}>
      <AuthDispatchContext.Provider value={dispatch}>
        {children}
      </AuthDispatchContext.Provider>
    </AuthStateContext.Provider>
  )
}

export const useAuthState = () => useContext(AuthStateContext)
export const useAuthDispatch = () => useContext(AuthDispatchContext)