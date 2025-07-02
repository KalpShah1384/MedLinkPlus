import React from 'react';
import { AppContext } from '../context/AppContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = React.useContext(AppContext);

  const toggle = () => {
    toggleTheme();
    console.log('Theme toggled to:', theme === 'light' ? 'dark' : 'light');
  };

  return (
    <button
      onClick={toggle}
      className="fixed top-3 right-96 z-50 p-2 rounded-lg bg-white dark:bg-gray-800 shadow-lg dark:shadow-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
      title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
      style={{
        pointerEvents: 'auto',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        backdropFilter: 'blur(5px)',
        WebkitBackdropFilter: 'blur(5px)'
      }}
    >
      <svg className="w-6 h-6 text-gray-800 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        {theme === 'light' ? (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        ) : (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 1.536l-.105-.105A5.5 5.5 0 0018 10.5V6a5.5 5.5 0 00-11 0v4.5m11 0l-.105-.105M6 12H4.5m7.5 3H9m6.364-1.337l-.105-.105A5.5 5.5 0 0012 13.5V18a5.5 5.5 0 0011 0v-4.5m-11 0l-.105-.105M12 10.5V4.636" />
        )}
      </svg>
    </button>
  );
};

export default ThemeToggle;
