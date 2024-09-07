import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import ErrorPage from './utils/ErrorPage';
import LoginPage from './pages/public/login/loginPage';
import TachePage from './pages/security/tache/tachePage';
import { useState } from 'react';
import AuthGard from './utils/AuthGard';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleToggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<LoginPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route element={<AuthGard />}>
        <Route 
          path="task" 
          element={<TachePage onToggleTheme={handleToggleTheme} isDarkMode={isDarkMode} />} 
        />
        </Route>
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
