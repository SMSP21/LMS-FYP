import React, { createContext, useReducer, useContext, useEffect } from 'react';
import axios from 'axios';

const UserContext = createContext();

const initialState = {
  isLoggedIn: false,
  userType: null,
  username: null,
  userData: {},
  isLoading: false,
  error: null,
};

const userReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        isLoggedIn: true,
        userType: action.userType || null,
        username: action.username || null,
        userData: action.userData || {},
        isLoading: false,
        error: null,
      };
    case 'LOGOUT':
      return initialState;
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.error,
        isLoading: false,
      };
    default:
      return state;
  }
};

export const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'SET_LOADING', isLoading: true });
      try {
        const response = await axios.get('/api/user');
        const { username, userType } = response.data;
        dispatch({ type: 'LOGIN', username, userType });
      } catch (error) {
        dispatch({ type: 'SET_ERROR', error: error.message });
      }
    };

    fetchData();
  }, []);

  const login = (username, userType) => {
    dispatch({ type: 'LOGIN', username, userType });
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <UserContext.Provider value={{ state, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }

  return context;
};
