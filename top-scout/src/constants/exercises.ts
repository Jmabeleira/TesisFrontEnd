/* Ejercicios que el backend sabe analizar (exercise_id del job). */
export interface ExerciseOption {
  id: string;
  label: string;
}

export const EXERCISES: ExerciseOption[] = [
  { id: "2", label: "Ejercicio 2: Técnica - Sensopercepción" },
  { id: "3", label: "Ejercicio 3: Velocidad" },
  { id: "6", label: "Ejercicio 6: Conducción en velocidad" },
];

/** Nombre a mostrar para un exercise_id; si no es conocido, "Ejercicio N". */
export function exerciseLabel(id: string | number): string {
  const key = String(id);
  return EXERCISES.find((exercise) => exercise.id === key)?.label ?? `Ejercicio ${key}`;
}
