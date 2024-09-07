import axios from 'axios';

// Utilisation de la variable d'environnement pour définir l'URL de base
const baseURL = import.meta.env.VITE_BASE_URL || 'http://localhost:3007';
const timeout = import.meta.env.TIMEOUT || 5000;

const apiClient = axios.create({
    baseURL,
    timeout,
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  export interface RestResponse<T> {
    token: string;
    message: string;
    status: string;
    results: T
  }

export default apiClient;
