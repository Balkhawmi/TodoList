import { Navigate, Outlet } from "react-router-dom";
import { authService } from "../services/AuthService";

export interface CustomJwtPayload {
  id: number;
  username: string
}
export default function AuthGard() {
    const logged=authService.isLogged();
    if (!logged) return <Navigate to="/login" />;
  return <Outlet />
}
