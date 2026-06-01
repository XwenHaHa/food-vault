'use client';

import { useCallback, useState } from 'react';
import { useAppStore } from '@/store';
import type { StoreFilters } from '@/types';

export function useSearch() {
  const { searchResults, loading, filters, setFilters, search } = useAppStore();
  const [searchTerm, setSearchTerm] = useState(filters.search || '');

  const updateSearch = useCallback(
    (term: string) => {
      setSearchTerm(term);
      setFilters({ ...filters, search: term });
    },
    [filters, setFilters]
  );

  const updateFilter = useCallback(
    (key: keyof StoreFilters, value: string) => {
      const newFilters = { ...filters, [key]: value };
      setFilters(newFilters);
    },
    [filters, setFilters]
  );

  const executeSearch = useCallback(() => {
    search();
  }, [search]);

  return {
    results: searchResults,
    loading,
    filters,
    searchTerm,
    updateSearch,
    updateFilter,
    executeSearch,
  };
}
