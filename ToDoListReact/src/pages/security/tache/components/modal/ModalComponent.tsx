import React, { useState, useEffect } from "react";
import { Modal } from "flowbite-react";
import './ModalComponent.css';
import tacheService from "../../../../../services/tacheService";
import { authService } from "../../../../../services/AuthService";

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

    const user = authService.getTokenInfo();
    const userId = user?.id;
    const newTache = {
      libelle: libelle,
      statut: "incomplete",
      etat: true,
      userId: userId
    };

    try {
      if (taskToEdit) {
        // Mise à jour de la tâche existante
        await tacheService.updateTache(taskToEdit.id, { libelle });
        setTaskToEdit(null); // Réinitialiser après édition
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
