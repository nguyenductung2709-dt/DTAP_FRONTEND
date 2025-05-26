import { useEffect, useState, Dispatch, SetStateAction } from 'react';

const useLocalStorage = <T,>(key: string, initialValue: T): [T, Dispatch<SetStateAction<T>>] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue: Dispatch<SetStateAction<T>> = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
};

const useDarkMode = (): [boolean, Dispatch<SetStateAction<boolean>>] => {
  const [enabled, setEnabled] = useLocalStorage<boolean>('dark-theme', false);

  useEffect(() => {
    const className = 'dark';
    const bodyClass = window.document.body.classList;

    if (enabled) {
      bodyClass.add(className);
    } else {
      bodyClass.remove(className);
    }
  }, [enabled]);

  return [enabled, setEnabled];
};

export default useDarkMode;