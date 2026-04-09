import { create } from 'zustand';

// CV ma'lumotlari uchun qat'iy TypeScript qoidalari
export interface Experience {
  id: string;
  company: string;
  role: string;
  description: string;
}

export interface CvState {
  fullName: string;
  profession: string;
  bio: string;
  skills: string;
  experience: Experience[];
  updateField: (field: keyof Omit<CvState, 'updateField' | 'addExperience' | 'removeExperience' | 'updateExperience'>, value: string) => void;
  addExperience: () => void;
  removeExperience: (id: string) => void;
  updateExperience: (id: string, field: keyof Experience, value: string) => void;
}

// Global omborni yaratamiz
export const useCvStore = create<CvState>((set) => ({
  fullName: '',
  profession: '',
  bio: '',
  skills: '',
  experience: [],
  
  // Oddiy maydonlarni yangilash
  updateField: (field, value) => set((state) => ({ ...state, [field]: value })),

  // Yangi tajriba qo'shish
  addExperience: () => set((state) => ({
    experience: [
      ...state.experience,
      { id: crypto.randomUUID(), company: '', role: '', description: '' }
    ]
  })),

  // Tajribani o'chirish
  removeExperience: (id) => set((state) => ({
    experience: state.experience.filter(exp => exp.id !== id)
  })),

  // Tajriba ma'lumotlarini yangilash
  updateExperience: (id, field, value) => set((state) => ({
    experience: state.experience.map(exp => 
      exp.id === id ? { ...exp, [field]: value } : exp
    )
  })),
}));