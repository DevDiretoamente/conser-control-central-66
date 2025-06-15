
import { useMemo, useState } from 'react';

interface UseVirtualScrollProps {
  items: any[];
  itemHeight: number;
  containerHeight: number;
}

export function useVirtualScroll({ items, itemHeight, containerHeight }: UseVirtualScrollProps) {
  const [scrollTop, setScrollTop] = useState(0);

  const visibleItems = useMemo(() => {
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(
      startIndex + Math.ceil(containerHeight / itemHeight) + 1,
      items.length
    );

    return {
      startIndex,
      endIndex,
      visibleItems: items.slice(startIndex, endIndex),
      totalHeight: items.length * itemHeight,
      offsetY: startIndex * itemHeight,
    };
  }, [items, itemHeight, containerHeight, scrollTop]);

  return {
    ...visibleItems,
    setScrollTop,
  };
}
