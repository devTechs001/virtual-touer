import { create } from 'zustand';

const useThemeStore = create((set) => ({
  isDarkMode: false,
  
  toggleTheme: () => {
    set((state) => {
      const newMode = !state.isDarkMode;
      
      // Update document class for Tailwind dark mode
      if (newMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      
      return { isDarkMode: newMode };
    });
  },

  setDarkMode: (isDark) => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    set({ isDarkMode: isDark });
  },
}));

// Initialize theme from system preference
if (typeof window !== 'undefined') {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (prefersDark) {
    document.documentElement.classList.add('dark');
  }
}

export default useThemeStore;
