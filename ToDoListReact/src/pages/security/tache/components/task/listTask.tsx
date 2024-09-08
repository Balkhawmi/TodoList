import React, { useState, useEffect } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import "./listTask.css";
import tacheService from "../../../../../services/tacheService";

interface TaskProps {
  id: number; // Changer 'string' en 'number'
  libelle: string;
  statut: string;
  onEdit: (id: number) => void; // Changer 'string' en 'number'
  onDelete: (id: number) => void; // Changer 'string' en 'number'
  fetchTasks: () => void;
}

const Task: React.FC<TaskProps> = ({ id, libelle, statut, onEdit, onDelete, fetchTasks }) => {
  const [isChecked, setIsChecked] = useState(statut === "complete");

  useEffect(() => {
    setIsChecked(statut === "complete");
  }, [statut]);

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const handleCheckboxChange = async () => {
    const newStatut = isChecked ? "incomplete" : "complete";
    setIsChecked(!isChecked);

    try {
      await tacheService.updateTache(id, { statut: newStatut });
      await fetchTasks();
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut :", error);
      setIsChecked(isChecked);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="task flex justify-around"
    >
      <div className="w-5/6">
        <input
          type="checkbox"
          className="checkbox"
          checked={isChecked}
          onChange={handleCheckboxChange}
        />
        <span className={isChecked ? "line-through text-gray-400" : ""}>
          {libelle}
        </span>
      </div>
      <div className="flex justify-around w-1/6">
        <svg
          className="Edit w-6 h-6 icone1 text-gray-300 dark:text-white"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          viewBox="0 0 24 24"
          onClick={() => onEdit(id)}
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"
          />
        </svg>
        <svg
          className="Delete w-6 h-6 text-gray-300 dark:hover:text-red-800 hover:text-red-800"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          viewBox="0 0 24 24"
          onClick={() => onDelete(id)}
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"
          />
        </svg>
      </div>
    </div>
  );
};

interface ListTaskProps {
  tasks: { id: number; libelle: string; statut: string }[]; // Changer 'string' en 'number'
  onEdit: (id: number) => void; // Changer 'string' en 'number'
  onDelete: (id: number) => void; // Changer 'string' en 'number'
  fetchTasks: () => void;
}

const ListTask: React.FC<ListTaskProps> = ({ tasks, onEdit, onDelete, fetchTasks }) => {
  return (
    <div className="task-list">
      {tasks.map((task) => (
        <Task
          key={task.id}
          id={task.id}
          libelle={task.libelle}
          statut={task.statut}
          onEdit={onEdit}
          onDelete={onDelete}
          fetchTasks={fetchTasks}
        />
      ))}
    </div>
  );
};

export default ListTask;