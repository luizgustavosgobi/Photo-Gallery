'use client';

import { useState, useCallback, SetStateAction, Dispatch } from 'react';

type UseQueryOptions = {
  url: string;
  method?: string;
  headers?: Record<string, string>;
  body?: object | string | FormData;
};

type UseQueryResult<T> = {
  data: T | null;
  loading: boolean;
  error: {
    get: Error | null,
    set: Dispatch<SetStateAction<Error | ApiError | null>>
  }
  fetch: (overrides?: Partial<UseQueryOptions>) => Promise<void>;
  setOptions: Dispatch<SetStateAction<UseQueryOptions>>;
};

export type DefaultApiMessage = {
  success: boolean,
  message: string
}

export class ApiError extends Error {
  status: number;
  
  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export function useQuery<T>(initialOptions: UseQueryOptions): UseQueryResult<T> {
  const [options, setOptions] = useState<UseQueryOptions>(initialOptions);
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | ApiError | null>(null);

  const fetchData = useCallback(async (overrides?: Partial<UseQueryOptions>) => {
    const opts = { ...options, ...(overrides || {}) };
    setLoading(true);
    setError(null);

    try {
      const headers: Record<string, string> = opts.headers ? { ...opts.headers } : {};
      
      const isFormData = opts.body instanceof FormData;
      if (!isFormData && !headers['Content-Type'] && !headers['content-type']) {
        headers['Content-Type'] = 'application/json';
      }

      const bodyToSend = opts.body
        ? isFormData ? opts.body as FormData : JSON.stringify(opts.body)
        : undefined;

      const response = await fetch(opts.url, {
        method: opts.method || 'GET',
        headers,
        body: bodyToSend,
      });

      const result = await response.json();
      if (!response.ok)
        throw new ApiError(result?.message || 'Erro interno no servidor', response.status);

      setData(result);
      setError(null);
    } catch (err) {
      setError(err instanceof ApiError ? err : new ApiError("Erro interno no servidor", 500));
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [options]);

  return {
    data,
    loading,
    error: {
      get: error,
      set: setError
    },
    fetch: fetchData,
    setOptions
  };
}