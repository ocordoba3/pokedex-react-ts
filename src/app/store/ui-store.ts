import { create } from "zustand";

type Store = {
  isLoading: boolean;
  startLoading: () => void;
  stopLoading: () => void;
};

const useUiStore = create<Store>()((set) => ({
  isLoading: false,
  startLoading: () => set(() => ({ isLoading: true })),
  stopLoading: () => set(() => ({ isLoading: false })),
}));

export default useUiStore;
