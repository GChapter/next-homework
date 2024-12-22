import { create } from "zustand";

interface Student {
  id: number;
  studentName: string;
  className: string;
}

interface StudentStore {
  student: Student | null;
  setStudent: (student: Student) => void;
  clearStudent: () => void;
}

const useStudentStore = create<StudentStore>((set) => ({
  student: null,
  setStudent: (student) => set({ student }),
  clearStudent: () => set({ student: null }),
}));

export default useStudentStore;
