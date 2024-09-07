import TachesList from "../models/tache.model";
import axiosFetch from "./axios.fetch";

const getTaches = () => axiosFetch.useData<TachesList[]>('/taches');
const getTacheByUser = (userId: string | number) => axiosFetch.useData<TachesList>(`/taches/${userId}`);
const createTache = (data: TachesList) => axiosFetch.usePost<TachesList>('/taches', data, 'POST');
const updateTache = (id: string | number, data: TachesList) => axiosFetch.usePost<TachesList>(`/articles/${id}`, data, 'PUT');
const deleteTache = (id: string | number) => axiosFetch.usePost<void>(`/articles/${id}`, undefined, 'DELETE');

export const useTache ={
    getTaches,
    getTacheByUser,
    createTache,
    updateTache,
    deleteTache
};
