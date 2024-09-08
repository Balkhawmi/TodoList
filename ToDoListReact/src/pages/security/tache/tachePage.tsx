import React, { useState, useEffect } from "react";
import { DndContext, DragEndEvent, closestCorners, UniqueIdentifier  } from "@dnd-kit/core";
import { DragStartEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import "./tachePage.css";
import { Button } from 'flowbite-react';
import ModalComponent from './components/modal/ModalComponent';
import SearchBar from "./components/searchbar/SearchBar";
import ListTask from "./components/task/listTask";
import { authService } from "../../../services/AuthService";
import { useNavigate } from "react-router-dom";
import tacheService from "../../../services/tacheService";
import TachesList from "../../../models/tache.model";

interface TachePageProps {
  onToggleTheme: () => void;
  isDarkMode: boolean;
}

const TachePage: React.FC<TachePageProps> = ({ onToggleTheme, isDarkMode }) => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<TachesList[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<TachesList[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [taskToEdit, setTaskToEdit] = useState<TachesList | null>(null);
  const [draggingTaskId, setDraggingTaskId] = useState<number | null>(null);

  const fetchTasks = async () => {
    try {
      const user = authService.getTokenInfo();
      const userId = user?.id;
      const { data } = await tacheService.getTacheByUser(userId);
      setTasks(data);
      setFilteredTasks(data);
      setIsLoading(false);
    } catch (err) {
      setError("Failed to load tasks");
      console.log(err);
      
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const filterTasks = () => {
    let filtered = tasks;

    if (filter !== 'all') {
      filtered = filtered.filter(task => task.statut === filter);
    }

    if (searchTerm) {
      filtered = filtered.filter(task =>
        task.libelle.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredTasks(filtered);
  };

  useEffect(() => {
    filterTasks();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tasks, filter, searchTerm]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const handleTaskAdded = async () => {
    try {
      await fetchTasks();
    } catch (err) {
      console.error("Failed to refresh tasks:", err);
    }
  };

  const handleEdit = (id: number) => { // Changer 'string' en 'number'
    if (!draggingTaskId) {
      const taskToEdit = tasks.find(task => task.id === id);
      if (taskToEdit) {
        setTaskToEdit(taskToEdit);
        setIsModalOpen(true);
      }
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setTaskToEdit(null);
  };

  const handleDelete = async (id: number) => { // Changer 'string' en 'number'
    if (!draggingTaskId) {
      try {
        await tacheService.updateTache(id, { etat: false });
        const updatedTasks = tasks.filter(task => task.id !== id);
        setTasks(updatedTasks);
        setFilteredTasks(updatedTasks);
      } catch (err) {
        console.error("Failed to delete task:", err);
      }
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    const taskId = event.active.id as UniqueIdentifier;

    // Convertir le taskId en number avant de l'assigner
    setDraggingTaskId(Number(taskId)); // Convertir en 'number'
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    // Réinitialiser après la fin du glissement
    setDraggingTaskId(null);

    if (!over) return;

    const oldIndex = tasks.findIndex((task) => task.id === Number(active.id)); // Conversion ici aussi
    const newIndex = tasks.findIndex((task) => task.id === Number(over.id));

    if (oldIndex !== -1 && newIndex !== -1) {
      const newTasks = arrayMove(tasks, oldIndex, newIndex);
      setTasks(newTasks);
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className={`p-4 flex justify-center flex-wrap mt-4 ${isDarkMode ? 'dark' : ''}`}>
      <div className="w-full text-center">
        <h2 className="font-bold text-xl">TODO LIST</h2>
      </div>
      <div className="w-full flex flex-wrap justify-center">
        <SearchBar
          onSearch={handleSearch}
          onFilterChange={handleFilterChange}
          onToggleTheme={onToggleTheme}
          isDarkMode={isDarkMode}
        />
       <DndContext
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
        </DndContext>
        <SortableContext items={filteredTasks.map(task => String(task.id))}>
            {filteredTasks.length === 0 ? (
              <p className="empty">No tasks found</p>
            ) : (
              <ListTask
                tasks={filteredTasks}
                onEdit={(id) => {
                  // Prévenir l'action si le drag est en cours
                  if (!draggingTaskId) handleEdit(id);
                }}
                onDelete={(id) => {
                  // Prévenir l'action si le drag est en cours
                  if (!draggingTaskId) handleDelete(id);
                }}
                fetchTasks={fetchTasks}
              />
            )}
          </SortableContext>
        
      </div>
      <div>
        <Button
          className="flex justify-center items-center rounded-full deconnectbtn"
          onClick={handleLogout}
        >
          <svg className="w-8 h-8 text-white dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H8m12 0-4 4m4-4-4-4M9 4H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h2"/>
          </svg>
        </Button>
      </div>

      <Button
        className="flex justify-center items-center rounded-full addbtn"
        onClick={() => setIsModalOpen(true)}
      >
        <svg
          className="w-8 h-8 mt-1 text-white"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 12h14m-7 7V5"
          />
        </svg>
      </Button>

      <ModalComponent
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onTaskAdded={handleTaskAdded}
        taskToEdit={taskToEdit}
        setTaskToEdit={setTaskToEdit}
      />
    </div>
  );
};

export default TachePage;
