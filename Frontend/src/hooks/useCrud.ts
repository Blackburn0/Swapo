import { useState, useCallback } from 'react';

// Define the shape of the data entity
// T is a generic type for the data, which MUST have an 'id'
export interface EntityWithId {
  id: string | number;
}

// Define the return type of the hook
interface CrudHook<T extends EntityWithId> {
  data: T[];
  loading: boolean;
  error: Error | null;
  createItem: (item: Omit<T, 'id'>) => Promise<T>;
  readItems: () => Promise<void>;
  updateItem: (id: T['id'], item: Partial<T>) => Promise<T>;
  deleteItem: (id: T['id']) => Promise<void>;
}

export const useCrud = <T extends EntityWithId>(
  baseUrl: string,
): CrudHook<T> => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  // --- READ (R) ---
  const readItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(baseUrl);
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const fetchedData: T[] = await response.json();
      setData(fetchedData);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [baseUrl]);

  // --- CREATE (C) ---
  const createItem = async (item: Omit<T, 'id'>): Promise<T> => {
    try {
      setLoading(true);
      const response = await fetch(baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const newItem: T = await response.json();
      setData((prev) => [...prev, newItem]); // Optimistic update or refetch
      return newItem;
    } catch (err) {
      setError(err as Error);
      throw err; // Re-throw to allow component to handle locally
    } finally {
      setLoading(false);
    }
  };

  // --- UPDATE (U) ---
  const updateItem = async (id: T['id'], updates: Partial<T>): Promise<T> => {
    try {
      setLoading(true);
      const response = await fetch(`${baseUrl}/${id}`, {
        method: 'PUT', // Or PATCH, depending on your API
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const updatedItem: T = await response.json();
      // Update the local state
      setData((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, ...updatedItem } : item,
        ),
      );
      return updatedItem;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // --- DELETE (D) ---
  const deleteItem = async (id: T['id']): Promise<void> => {
    try {
      setLoading(true);
      const response = await fetch(`${baseUrl}/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      // Remove from local state
      setData((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    error,
    createItem,
    readItems,
    updateItem,
    deleteItem,
  };
};
