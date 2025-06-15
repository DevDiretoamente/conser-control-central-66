
import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center mt-4">
      <button
        className="px-3 py-1 mx-1 rounded bg-gray-100 hover:bg-gray-200"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
      >
        Anterior
      </button>
      <span className="mx-2 text-sm">{currentPage} / {totalPages}</span>
      <button
        className="px-3 py-1 mx-1 rounded bg-gray-100 hover:bg-gray-200"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
      >
        Próxima
      </button>
    </div>
  );
};

export default Pagination;
