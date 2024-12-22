import { create } from "zustand";

interface ClassObj {
  id: number;
  className: string;
}

interface ClassStore {
  classObj: ClassObj | null;
  setClass: (classObj: ClassObj) => void;
  clearClass: () => void;
}

const useClassStore = create<ClassStore>((set) => ({
  classObj: null,
  setClass: (classObj) => set({ classObj }),
  clearClass: () => set({ classObj: null }),
}));

export default useClassStore;
