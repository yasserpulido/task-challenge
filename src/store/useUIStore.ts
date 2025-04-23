import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Task } from "../types";

type UIState = {
  showCompleted: boolean;
  toggleShowCompleted: () => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedTask: Task | null;
  setSelectedTask: (task: Task | null) => void;
};

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      showCompleted: true,
      toggleShowCompleted: () =>
        set((state) => ({ showCompleted: !state.showCompleted })),
      darkMode: false,
      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
      searchTerm: "",
      setSearchTerm: (term) => set({ searchTerm: term }),
      selectedTask: null,
      setSelectedTask: (task) => set({ selectedTask: task }),
    }),
    {
      name: "ui-store",
    }
  )
);
