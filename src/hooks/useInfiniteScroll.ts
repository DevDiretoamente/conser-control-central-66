
import { useCallback, useEffect, useRef, useState } from 'react';

interface UseInfiniteScrollProps {
  hasNextPage: boolean;
  isLoading: boolean;
  loadMore: () => void;
  threshold?: number;
}

export function useInfiniteScroll({
  hasNextPage,
  isLoading,
  loadMore,
  threshold = 100
}: UseInfiniteScrollProps) {
  const [isFetching, setIsFetching] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(() => {
    if (!containerRef.current || isLoading || !hasNextPage) return;

    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    
    if (scrollHeight - (scrollTop + clientHeight) <= threshold) {
      setIsFetching(true);
    }
  }, [isLoading, hasNextPage, threshold]);

  useEffect(() => {
    if (isFetching && hasNextPage && !isLoading) {
      loadMore();
      setIsFetching(false);
    }
  }, [isFetching, hasNextPage, isLoading, loadMore]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return { containerRef, isFetching };
}
