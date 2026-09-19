export function loadStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(`libris_${key}`);
    return item ? JSON.parse(item) : fallback;
  } catch (error) {
    console.warn(`Error reading localStorage key "${key}":`, error);
    return fallback;
  }
}

export function saveStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(`libris_${key}`, JSON.stringify(value));
  } catch (error) {
    console.warn(`Error writing to localStorage key "${key}":`, error);
  }
}
