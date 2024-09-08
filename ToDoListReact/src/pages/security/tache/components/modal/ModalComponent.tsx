import React, { useState, useEffect } from "react";
import { Modal } from "flowbite-react";
import './ModalComponent.css';
import tacheService from "../../../../../services/tacheService";
import { authService } from "../../../../../services/AuthService";
import TachesList from "../../../../../models/tache.model"; // Assure-toi que tu as bien ce fichier

interface ModalComponentProps {
  isOpen: boolean;
  onClose: () => void;
  onTaskAdded: () => void;
  taskToEdit: TachesList | null;
  setTaskToEdit: (task: TachesList | null) => void;
}

export function ModalComponent({ isOpen, onClose, onTaskAdded, taskToEdit, setTaskToEdit }: ModalComponentProps) {
  const [libelle, setLibelle] = useState("");

  useEffect(() => {
    if (taskToEdit) {
      setLibelle(taskToEdit.libelle); // Pré-remplir l'input avec le libellé de la tâche à éditer
    } else {
      setLibelle(""); // Si pas d'édition, vider l'input
    }
  }, [taskToEdit]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLibelle(event.target.value);
  };

  const handleApplyClick = async () => {
    if (libelle.trim() === "") return;
  
    const user = authService.getTokenInfo(); // Assurez-vous que le type retourné est CustomJwtPayload
    const userId = user?.id; // `id` est de type `number` dans CustomJwtPayload
  
    // Préparer la nouvelle tâche à créer
    const newTache: Omit<TachesList, 'id'> = {
      libelle,
      statut: "incomplete",
      etat: true,
      userId // Assurez-vous que `userId` est de type `number`
    };
  
    try {
      if (taskToEdit) {
        // On vérifie que l'ID de la tâche à éditer existe et est bien un nombre
        if (typeof taskToEdit.id !== 'undefined') {
          const updatedTache: Partial<TachesList> = { libelle }; // Mise à jour partielle de la tâche
          await tacheService.updateTache(taskToEdit.id, updatedTache); // Appel à la mise à jour avec un ID valide
          setTaskToEdit(null); // Réinitialiser après édition
        } else {
          throw new Error("Task ID is missing.");
        }
      } else {
        // Création d'une nouvelle tâche
        await tacheService.createTache(newTache);
      }
  
      onTaskAdded(); // Rafraîchir la liste des tâches
      onClose(); // Fermer le modal
    } catch (error) {
      console.error("Failed to create/update task:", error);
    }
  };

  return (
    <Modal show={isOpen} onClose={onClose} className='modal'>
      <Modal.Body className='modal1'>
        <div className="flex flex-wrap items-center space-y-2">
          <label htmlFor="libelle" className="w-full text-center block mb-2 text-xl font-bold text-gray-900 dark:text-white">
            {taskToEdit ? "Edit Task" : "New Task"} {/* Titre dynamique */}
          </label>
        </div>
        <div className='w-full mt-6'>
          <input
            type="text"
            id="libelle"
            className="w-full text-gray-900 text-sm rounded-lg p-2.5"
            placeholder="Task Name"
            required
            value={libelle}
            onChange={handleInputChange}
          />
        </div>
        <div className="butnn flex justify-between w-full mt-4">
          <button
            type="button"
            onClick={onClose}
            className="button1 font-medium rounded-lg text-sm px-5 py-2.5 text-center text-white"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleApplyClick}
            className="button font-medium rounded-lg text-sm px-5 py-2.5 text-center text-white"
            disabled={libelle.trim() === ""}
          >
            {taskToEdit ? "Update" : "Apply"} {/* Texte du bouton dynamique */}
          </button>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default ModalComponent;
 