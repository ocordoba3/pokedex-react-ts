import { create } from "zustand";

type Store = {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
};

const useUiStore = create<Store>()((set) => ({
  isLoading: false,
  setIsLoading: (isLoading: boolean) => set(() => ({ isLoading })),
}));

export default useUiStore;
