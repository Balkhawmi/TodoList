import { AxiosError } from 'axios';
import apiClient from './api-client';
import TachesList from '../models/tache.model';



class TacheService {
  private baseUri = '/taches';

  // Méthode pour obtenir tous les taches
  async getAllTaches() {
    try {
      const response = await apiClient.get(this.baseUri);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  // Méthode pour obtenir un tache par son ID
  async getTacheById(id: string | number) {
    try {
      const response = await apiClient.get(`${this.baseUri}/${id}`);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

   // Méthode pour obtenir un tache par son ID
   async getTacheByUser(userId: string | number) {
    try {
      const response = await apiClient.get(`${this.baseUri}/${userId}`);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

    // Méthode pour obtenir des tache par statut
    async tacheByStatut(statut: string ) {
        try {
          const response = await apiClient.get(`${this.baseUri}/statut/${statut}`);
          return response.data;
        } catch (error) {
          this.handleError(error);
        }
      }

  // Méthode pour créer un nouvel tache
  async createTache(data: Omit<TachesList, 'id'>) {
    try {
      const response = await apiClient.post(this.baseUri, data);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  // Méthode pour mettre à jour un tache par son ID
  async updateTache(id: string | number, data: Partial<TachesList>) {
    try {
      const response = await apiClient.put(`${this.baseUri}/${id}`, data);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  // Méthode pour supprimer un tache par son ID
  async deleteTache(id: string | number) {
    try {
      const response = await apiClient.delete(`${this.baseUri}/${id}`);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }



  // Méthode pour gérer les erreurs
  private handleError(error: unknown) {
    if (error instanceof AxiosError) {
      if (error.response) {
        console.error(`Erreur ${error.response.status}: ${error.response.data.message || 'Une erreur est survenue.'}`);
      } else if (error.request) {
        console.error('Impossible de se connecter au serveur. Veuillez réessayer plus tard.');
      } else {
        console.error('Une erreur s\'est produite lors de la demande.');
      }
    } else {
      console.error('Une erreur inconnue est survenue.');
    }
    throw error;
  }
}

export default new TacheService();
