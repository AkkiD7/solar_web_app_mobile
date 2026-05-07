import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { getErrorMessage } from '../api/client';

/**
 * Generic data-fetching hook that replaces the repeated
 * useState + useCallback + useEffect pattern in every page.
 *
 * A3 fix: eliminates ~15 lines of boilerplate per page.
 */
export function useApiQuery<T>(
  fetcher: () => Promise<T>,
  deps: React.DependencyList = [],
  errorMessage = 'Failed to load data'
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const mountedRef = useRef(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const result = await fetcher();
      if (mountedRef.current) setData(result);
    } catch (error) {
      if (mountedRef.current) toast.error(getErrorMessage(error, errorMessage));
    } finally {
      if (mountedRef.current) setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    mountedRef.current = true;
    void load();
    return () => {
      mountedRef.current = false;
    };
  }, [load]);

  return { data, loading, reload: load, setData };
}
