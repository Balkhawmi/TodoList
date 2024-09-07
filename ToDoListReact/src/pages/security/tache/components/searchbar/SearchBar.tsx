import React, { useState, useEffect, useCallback } from "react";
import './SearchBar.css';

interface SearchBarProps {
  onSearch: (term: string) => void;
  onFilterChange: (filter: string) => void;
  onToggleTheme: () => void;
  isDarkMode: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, onFilterChange, onToggleTheme, isDarkMode }) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Utiliser `useCallback` pour mémoriser la fonction de recherche
  const handleSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
    },
    []
  );

  // Utilise un tableau de dépendances stable pour `useEffect`
  useEffect(() => {
    // S'assure que `onSearch` ne provoque pas de re-rendu infini
    onSearch(searchTerm);
  }, [searchTerm, onSearch]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange(e.target.value); // Appelle la méthode de filtrage
  };

  const handleToggleTheme = () => {
    onToggleTheme(); // Notifie le parent du changement de thème
  };

  return (
    <div className="w-3/5 flex items-center justify-between p-4">
      <div className="relative w-full">
        <input
          type="search"
          id="search-dropdown"
          className="search p-2 rounded-md block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-e-lg"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={handleSearch}
        />
        <button
          type="submit"
          className="absolute top-0 end-0 p-2.5 text-sm font-medium h-full text-black-600 rounded-e-lg"
        >
          <svg
            className="serch-icon w-4 h-4"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
            />
          </svg>
        </button>
      </div>
      <select
        onChange={handleFilterChange}
        className="select ml-4 p-2 rounded-md text-white"
      >
        <option value="all">All</option>
        <option value="complete">Complete</option>
        <option value="incomplete">Incomplete</option>
      </select>
      <button
        onClick={handleToggleTheme}
        className="select ml-4 p-2 rounded-md bg-blue-500 text-white"
      >
        {isDarkMode ? (
          <svg
            className="w-6 h-6 text-gray-800 dark:text-white"
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
              d="M12 5V3m0 18v-2M7.05 7.05L5.636 5.636m12.728 12.728L16.95 16.95M5 12H3m18 0h-2M7.05 16.95l-1.414 1.414M18.364 5.636L16.95 7.05M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z"
            />
          </svg>
        ) : (
          <svg
            className="w-6 h-6 text-white dark:text-white"
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
              d="M12 21a9 9 0 0 1-.5-17.986V3c-.354.966-.5 1.911-.5 3a9 9 0 0 0 9 9c.239 0 .254.018.488 0A9.004 9.004 0 0 1 12 21Z"
            />
          </svg>
        )}
      </button>
    </div>
  );
};

export default SearchBar;
