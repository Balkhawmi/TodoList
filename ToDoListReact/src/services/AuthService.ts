import { jwtDecode } from "jwt-decode";
import apiClient, { RestResponse } from "./api-client";
import { CustomJwtPayload } from "../utils/AuthGard";

interface Credentials {
    username: string;
    password: string;
  }
  
  export type CredentialsOrNull = Credentials | null;
  
  const login = (credentials: CredentialsOrNull) => {
    return apiClient.post<RestResponse<{token: string }>>('/auth/login', credentials);
  }

  const register = (credentials: Credentials) => {
    return apiClient.post<RestResponse<{ results: unknown }>>('/auth/register', credentials);
  };
  
  /**
   * Suppression du token du localStorage
   */
  const logout = () => {
    localStorage.removeItem('token');
  }

  /**
 * Vérifie si l'utilisateur est connecté
 * @returns {boolean} 
 */
const isLogged = () => {
    const token = localStorage.getItem('token');
    return !!token;
  }

    /**
 * Vérifie si l'utilisateur est connecté
 * @returns {string} 
 */
  const getToken = () =>{
    return localStorage.getItem('token')
  }


  /**
 * Récupération du payload du token
 * @returns {object}
 */
  const getTokenInfo = (): CustomJwtPayload => {
    const token = getToken();
    if (!token) {
      throw new Error('Token is not available');
    }
    return jwtDecode<CustomJwtPayload>(token); // Spécifiez le type du payload ici
  };

  const getTokenInfoOther = (token: string) => {
    return jwtDecode(token);
  }
  
  const saveToken = (token: string) => {
    localStorage.setItem('token', token);
  }
  
  // Déclaration des services pour import
  export const authService = {
    login,
    register,
    logout,
    isLogged,
    getToken,
    getTokenInfo,
    getTokenInfoOther,
    saveToken
  }