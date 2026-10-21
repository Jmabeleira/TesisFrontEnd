/* Ejercicios que el backend sabe analizar (exercise_id del job). */
export interface ExerciseOption {
  id: string;
  label: string;
}

export const EXERCISES: ExerciseOption[] = [
  { id: "2", label: "Ejercicio 2" },
  { id: "3", label: "Ejercicio 3" },
  { id: "6", label: "Ejercicio 6" },
];
