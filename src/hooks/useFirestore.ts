import { useState, useEffect } from 'react';
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  onSnapshot,
  Timestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export function useFirestore<T>(collectionName: string) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, collectionName),
      (snapshot) => {
        const items = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as T[];
        setData(items);
        setLoading(false);
      },
      (error) => {
        setError(error.message);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [collectionName]);

  const addItem = async (item: Omit<T, 'id'>) => {
    try {
      const docRef = await addDoc(collection(db, collectionName), {
        ...item,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      return docRef.id;
    } catch (error) {
      throw new Error(`Failed to add item: ${error}`);
    }
  };

  const updateItem = async (id: string, updates: Partial<T>) => {
    try {
      await updateDoc(doc(db, collectionName, id), {
        ...updates,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      throw new Error(`Failed to update item: ${error}`);
    }
  };

  const deleteItem = async (id: string) => {
    try {
      await deleteDoc(doc(db, collectionName, id));
    } catch (error) {
      throw new Error(`Failed to delete item: ${error}`);
    }
  };

  const getItem = async (id: string) => {
    try {
      const docSnap = await getDoc(doc(db, collectionName, id));
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as T;
      }
      return null;
    } catch (error) {
      throw new Error(`Failed to get item: ${error}`);
    }
  };

  return {
    data,
    loading,
    error,
    addItem,
    updateItem,
    deleteItem,
    getItem
  };
}