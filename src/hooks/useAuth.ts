import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { AuthState } from "../store/slice/auth.slice";

export const useAuth = () => {
  return useSelector<RootState, AuthState>((state) => state.auth);
};

export const useIsAuthenticated = () => {
  return Boolean(sessionStorage.getItem("__kajaru_access_"));
};
