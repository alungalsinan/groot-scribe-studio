import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type TableName = keyof Database['public']['Tables'];

export function useSupabaseData<T extends Record<string, any>>(
  table: TableName,
  options?: {
    filter?: { column: string; value: any };
    orderBy?: { column: string; ascending?: boolean };
    limit?: number;
  }
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
    const channel = subscribeToChanges();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [table, JSON.stringify(options)]);

  const fetchData = async () => {
    try {
      let query = supabase.from(table).select('*') as any;

      if (options?.filter) {
        query = query.eq(options.filter.column, options.filter.value);
      }

      if (options?.orderBy) {
        query = query.order(options.orderBy.column, {
          ascending: options.orderBy.ascending ?? false,
        });
      }

      if (options?.limit) {
        query = query.limit(options.limit);
      }

      const { data, error } = await query;

      if (error) throw error;
      setData((data as T[]) || []);
      setLoading(false);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const subscribeToChanges = () => {
    const channel = supabase
      .channel(`${table}-changes`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: table,
        },
        () => {
          fetchData();
        }
      )
      .subscribe();

    return channel;
  };

  const addItem = async (item: any) => {
    try {
      const { data, error } = await supabase
        .from(table)
        .insert([item] as any)
        .select()
        .single();

      if (error) throw error;
      return data as unknown as T;
    } catch (err: any) {
      throw new Error(`Failed to add item: ${err.message}`);
    }
  };

  const updateItem = async (id: string, updates: Partial<T>) => {
    try {
      const { error } = await supabase
        .from(table)
        .update(updates as any)
        .eq('id', id);

      if (error) throw error;
    } catch (err: any) {
      throw new Error(`Failed to update item: ${err.message}`);
    }
  };

  const deleteItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (err: any) {
      throw new Error(`Failed to delete item: ${err.message}`);
    }
  };

  const getItem = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as unknown as T;
    } catch (err: any) {
      throw new Error(`Failed to get item: ${err.message}`);
    }
  };

  return {
    data,
    loading,
    error,
    addItem,
    updateItem,
    deleteItem,
    getItem,
    refetch: fetchData,
  };
}
