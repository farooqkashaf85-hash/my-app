import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {loginUser , signupUser , logout} from '../store/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const login = useCallback((credentials) => dispatch(loginUser(credentials)), [dispatch]);
  const signup = useCallback((credentials) => dispatch(signupUser(credentials)), [dispatch]);
  const logoutUser = useCallback(() => dispatch(logout()), [dispatch]);

  return {
    ...authState,
    login,
    signup,
    logout: logoutUser,
  };
}