import {usedispatch, useSelector} from 'react-redux';
import {loginUser , signupUser , logout} from '../store/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);

  return {
    ...authState,
    login: (credentials) => dispatch(loginUser(credentials)),
    signup: (credentials) => dispatch(signupUser(credentials)),
    logout: () => dispatch(logout()),
  };
}