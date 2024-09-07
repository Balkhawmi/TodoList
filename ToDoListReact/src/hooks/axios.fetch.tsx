import { useState, useEffect } from 'react'; 
import { AxiosRequestConfig, CanceledError } from 'axios';
import { StatusCodes } from 'http-status-codes';
import apiClient from '../services/api-client';
import { authService } from '../services/AuthService';

// Typing for the API response
type ResponseType<T> = T | T[] | null;
interface FetchResponse<T> {
    status: StatusCodes;
    data: ResponseType<T>; // Utilisez `data` au lieu de `results`
    message: string;
  }
  

//eslint-disable-next-line @typescript-eslint/no-explicit-any
const useData = <T,>(endpoint: string, requestConfig?: AxiosRequestConfig, deps?: any[]) => {
    const [data, setData] = useState<T[] | T | null>(null);
    const [error, setError] = useState('');
    const [isLoading, setLoading] = useState(false);
  
    useEffect(() => {
      const controller = new AbortController();
      const { signal } = controller; // Extract the signal from the controller
  
      // Récupérer le token
      const token = authService.getToken();
  
      setLoading(true);
      apiClient
        .get<FetchResponse<T>>(endpoint, {
          signal,
          ...requestConfig,
          headers: {
            'Authorization': `Bearer ${token}`, // Ajouter l'autorisation
            ...requestConfig?.headers,
          },
        })
        .then((res) => {
          // Vérifiez la réponse complète
          console.log('Response data:', res.data);
  
          if (res.data.status === StatusCodes.OK) {
            console.log('Data:', res.data.data); // Utilisez `data` au lieu de `results`
            setData(res.data.data);
          } else {
            setError(res.data.message || 'Erreur lors de la récupération des données');
          }
          setLoading(false);
        })
        .catch((err) => {
          if (err instanceof CanceledError) return;
          setError(err.message);
          setLoading(false);
        });
  
      return () => controller.abort();
    }, deps ? [...deps] : []);
  
    return { data, error, isLoading };
  };
  


//eslint-disable-next-line @typescript-eslint/no-explicit-any
const usePost = <RES,>(endpoint: string, formData?: any, method: string = "GET", requestConfig?: AxiosRequestConfig, deps?: any[]) => {
    const [data, setData] = useState<RES | RES[] | null>(null);
    const [error, setError] = useState('');
    const [isLoading, setLoading] = useState(false);
  
    useEffect(() => {
      const controller = new AbortController();
      const { signal } = controller; // Extract the signal from the controller
  
      setLoading(true);
  
      apiClient
        .request<FetchResponse<RES>>({
          signal,
          method,
          data: formData,
          url: endpoint,
          ...requestConfig,
        })
        .then((res) => {
          // Vérifiez la réponse complète
          console.log('Response data:', res.data);
  
          if (res.data.status === StatusCodes.OK) {
            console.log('Data:', res.data.data); // Utilisez `data` au lieu de `results`
            setData(res.data.data);
          } else {
            setError(res.data.message || 'Erreur lors de l\'envoi des données');
          }
          setLoading(false);
        })
        .catch((err) => {
          if (err instanceof CanceledError) return;
          setError(err.message);
          setLoading(false);
        });
  
      return () => controller.abort();
    }, deps ? [...deps] : []);
  
    return { data, error, isLoading };
  };
  

  export default {
    useData,
    usePost,
  };